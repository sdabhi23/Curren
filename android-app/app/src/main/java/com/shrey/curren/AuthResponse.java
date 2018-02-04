package com.shrey.curren;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Shrey on 1/26/2018.
 */

public class AuthResponse {

    @SerializedName("hasura_id")
    int hasuraId;

    @SerializedName("auth_token")
    String authToken;

    @SerializedName("roles")
    String[] roles;

    public int getHasuraId() {
        return hasuraId;
    }

    public String getAuthToken() {
        return authToken;
    }

    public String[] getRoles() {
        return roles;
    }

}
