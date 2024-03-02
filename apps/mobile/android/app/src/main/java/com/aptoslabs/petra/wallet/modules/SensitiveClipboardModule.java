// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

package com.aptoslabs.petra.wallet.modules;

import android.content.ClipData;
import android.content.ClipDescription;
import android.content.ClipboardManager;
import android.content.Context;
import android.os.Build;
import android.os.PersistableBundle;

import androidx.work.ExistingWorkPolicy;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.util.concurrent.TimeUnit;

@ReactModule(name = SensitiveClipboardModule.NAME)
public class SensitiveClipboardModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;

    /**
     * A module for the Clipboard used to store sensitive data.
     *
     * @param context React context of the application
     */
    SensitiveClipboardModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    /**
     * Export RTC module name
     */
    public static final String NAME = "SensitiveClipboard";

    /**
     * The clipboard can only maintain one work request. If there is an existing
     * work request (uncompleted), it will be replaced with new ones.
     */
    public static final String WORK_TAG = "SensitiveClipboard_ClearClipboard";

    @Override
    public String getName() {
        return SensitiveClipboardModule.NAME;
    }

    private WorkManager getWorkService() {
        return WorkManager.getInstance(reactContext.getApplicationContext());
    }

    private ClipboardManager getClipboardService() {
        return (ClipboardManager) reactContext.getSystemService(Context.CLIPBOARD_SERVICE);
    }

    /**
     * Start a new WorkManager to clear the clipboard after `duration` (seconds).
     *
     * @param duration the seconds before the clipboard is cleared.
     */
    private void beginClearClipboardWork(double duration) {
        OneTimeWorkRequest request = new OneTimeWorkRequest.Builder(ClearClipboardWorker.class)
                .setInitialDelay((long) duration, TimeUnit.SECONDS).build();
        WorkManager workManager = getWorkService();
        workManager.enqueueUniqueWork(
                SensitiveClipboardModule.WORK_TAG,
                ExistingWorkPolicy.REPLACE,
                request);
    }

    @ReactMethod
    public void setString(String text, double duration) {
        ClipData clipData = ClipData.newPlainText(null, text);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1
                && Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            PersistableBundle bundle = new PersistableBundle();
            bundle.putBoolean(ClipDescription.EXTRA_IS_SENSITIVE, true);
            clipData.getDescription().setExtras(bundle);
        }
        ClipboardManager clipboard = getClipboardService();
        clipboard.setPrimaryClip(clipData);
        beginClearClipboardWork(duration);
    }

}
