package com.aptoslabs.petra.wallet.modules;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

public class ClearClipboardWorker extends Worker {

    /**
     * Worker used to clear the clipboard.
     */
    public ClearClipboardWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    private ClipboardManager getClipboardService() {
        return (ClipboardManager) getApplicationContext().getSystemService(Context.CLIPBOARD_SERVICE);
    }

    /**
     * Clear the current clipboard
     */
    private void clearClipboard() {
        ClipboardManager clipboard = getClipboardService();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            clipboard.clearPrimaryClip();
        } else {
            clipboard.setPrimaryClip(ClipData.newPlainText(null, ""));
        }
    }

    @NonNull
    @Override
    public Result doWork() {
        clearClipboard();
        return Result.success();
    }

    @Override
    public void onStopped() {
        super.onStopped();
        clearClipboard();
    }
}
