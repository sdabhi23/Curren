package com.shrey.curren;

import android.app.ProgressDialog;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.widget.Toast;

/**
 * Created by Shrey on 1/26/2018.
 */

public class BaseActivity extends AppCompatActivity {

    ProgressDialog progressDialog;

    AlertDialog.Builder alertBuilder;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        progressDialog = new ProgressDialog(this);
        alertBuilder = new AlertDialog.Builder(this);
    }

    public void showProgressDialog(final String message) {
        runOnUiThread(() -> {
            progressDialog.setMessage(message);
            progressDialog.show();
        });
    }

    public void dismissProgressDialog() {
        runOnUiThread(() -> progressDialog.dismiss());
    }

    public void showToast(final String message) {
        runOnUiThread(() -> Toast.makeText(BaseActivity.this, message, Toast.LENGTH_SHORT).show());
    }

    public void showDialog(final  String title, final String message) {
        runOnUiThread(() -> {
            alertBuilder
                    .setTitle(title)
                    .setMessage(message)
                    .setPositiveButton("OK", (dialog, id) -> {
                        dialog.dismiss();
                    })
                    .show();
        });
    }
}
