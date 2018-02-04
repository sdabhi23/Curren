package com.shrey.curren;

import com.google.firebase.database.FirebaseDatabase;

/**
 * Created by Shrey on 1/27/2018.
 */

public class FirebaseApp extends android.app.Application {
    @Override
    public void onCreate() {
        super.onCreate();
        FirebaseDatabase.getInstance().setPersistenceEnabled(true);
    }
}