package com.shrey.curren;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.gson.Gson;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Created by Shrey on 1/26/2018.
 */

public class AuthActivity extends BaseActivity{

    EditText username, password;
    LinearLayout loginLayout;
    private FirebaseAuth mAuth;
    static String uname = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_auth);

        loginLayout = findViewById(R.id.loginLayout);

        username = findViewById(R.id.username);
        password = findViewById(R.id.password);

        mAuth = FirebaseAuth.getInstance();

        findViewById(R.id.signInButton).setOnClickListener(v -> {
            if (checkIfFormIsValid()) {
                performAuthentication(username.getText().toString(), password.getText().toString(), false);
            }
        });

        findViewById(R.id.signUpButton).setOnClickListener(v -> {
            if (checkIfFormIsValid()) {
                performAuthentication(username.getText().toString(), password.getText().toString(), true);
            }
        });
        refreshLayout();
    }

    //if logged in, show logout layout
    private void refreshLayout() {
        runOnUiThread(() -> {
            if (Hasura.getSessionToken(AuthActivity.this) != null) {
                username.setText("");
                password.setText("");
                SharedPreferences sharedPref = AuthActivity.this.getPreferences(Context.MODE_PRIVATE);
                uname = sharedPref.getString(getString(R.string.saved_uname), "");
                Intent i = new Intent(this, ChatActivity.class);
                startActivity(i);
                finish();
            }
        });
    }

    private Boolean checkIfFormIsValid() {
        if (username.getText().toString().isEmpty()) {
            showToast("Username cannot be left empty");
            return false;
        }
        if (password.getText().toString().isEmpty()) {
            showToast("Password cannot be left empty");
            return false;
        }
        return true;
    }

    private void performAuthentication(String username, String password, boolean signUp) {
        String url = Hasura.Config.AUTH_URL + (signUp ? "signup" : "login");
        showProgressDialog("Please wait");
        try {
            OkHttpClient client = new OkHttpClient();

            MediaType mediaType = MediaType.parse("application/json");
            //Username Provider
            JSONObject jsonObject = new JSONObject()
                    .put("provider", "username")
                    .put("data", new JSONObject()
                            .put("username", username)
                            .put("password", password)
                    );

            RequestBody body = RequestBody.create(mediaType, jsonObject.toString());
            Request request = new Request.Builder()
                    .url(url)
                    .post(body)
                    .build();

            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(okhttp3.Call call, IOException e) {
                    dismissProgressDialog();
                    AuthActivity.super.showDialog("Authentication Failed", e.getLocalizedMessage());
                }

                @Override
                public void onResponse(okhttp3.Call call, Response response) throws IOException {
                    dismissProgressDialog();
                    //Handle success
                    String jsonString = response.body().string();
                    if (response.isSuccessful()) {
                        AuthResponse authResponse = new Gson().fromJson(jsonString, AuthResponse.class);
                        //Save the response offline to be used later
                        Hasura.saveSessionToken(authResponse.authToken, AuthActivity.this);
                        mAuth.signInAnonymously().addOnCompleteListener(AuthActivity.this, (Task<AuthResult> task) -> {
                            if (task.isSuccessful()) {
                                Log.d("Firebase Auth", "signInAnonymously:success");
                                    SharedPreferences sharedPref = AuthActivity.this.getPreferences(Context.MODE_PRIVATE);
                                    SharedPreferences.Editor editor = sharedPref.edit();
                                    editor.putString(getString(R.string.saved_uname), username);
                                    editor.commit();
                                uname = username;
                                showToast("Authenticated successfully!");
                                refreshLayout();
                            } else {
                                // If sign in fails, display a message to the user.
                                Log.w("Firebase Auth", "signInAnonymously:failure", task.getException());
                                AuthActivity.super.showDialog("Authentication Failed", "Firebase Authentication Error");
                                performLogout();
                            }
                        });
                    } else {
                        try {
                            JSONObject responseJson = new JSONObject(jsonString);
                            String msg = responseJson.getString("message");
                            AuthActivity.super.showDialog("Authentication Failed", msg);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }
            });

        } catch (JSONException e) {
            dismissProgressDialog();
            e.printStackTrace();
            AuthActivity.super.showDialog("Authentication Failed", e.getLocalizedMessage());
        }
    }

    private void performLogout() {
        showProgressDialog("Logging out...");
        String url = Hasura.Config.AUTH_URL + "user/logout";
        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/json");
        //Username Provider
        JSONObject jsonObject = new JSONObject();
        RequestBody body = RequestBody.create(mediaType, jsonObject.toString());
        Request request = new Request.Builder()
                .url(url)
                //Add authorization header as only authenticated users can logout
                .addHeader("Authorization", "Bearer " + Hasura.getSessionToken(AuthActivity.this))
                .post(body)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(okhttp3.Call call, IOException e) {
                dismissProgressDialog();
                //Handle failure
                Log.w("Hasura Auth", e.getLocalizedMessage());

            }

            @Override
            public void onResponse(okhttp3.Call call, Response response) throws IOException {
                dismissProgressDialog();
                //Handle success
                String jsonString = response.body().string();
                if (response.isSuccessful()) {
                    //Delete the saved response
                    Hasura.saveSessionToken(null, AuthActivity.this);
                    username.setText("");
                    password.setText("");
                } else {
                    try {
                        JSONObject responseJson = new JSONObject(jsonString);
                        String msg = responseJson.getString("message");
                        Log.w("Hasura Auth", msg);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }
}
