package com.shrey.curren;

import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.TextView;

/**
 * Created by Shrey on 1/27/2018.
 */

public class ChatView extends RecyclerView.ViewHolder  {

    TextView leftText,rightText;

    public ChatView(View itemView){
        super(itemView);
        leftText = itemView.findViewById(R.id.leftText);
        rightText = itemView.findViewById(R.id.rightText);
    }
}
