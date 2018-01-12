package com.android.gles3jni;
import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;
import android.util.Log;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * Created by manina7539 on 02/01/2018.
 */

public class ApplicationManager {
    public final static String TAG = ApplicationManager.class.getName();
    public final static String fromPath = "ShadersES3";
    public static String toPath;  // Your application path
    static ExecutorService executorService = Executors.newCachedThreadPool();
//    private static Mat colorMat, depthMat;
//
//    public static void setColorMat(Mat mat) {colorMat = mat;}
//
//    public static void setDepthMat(Mat mat) {depthMat = mat;}
//
//    public static Mat getColorMat() {return colorMat;}
//
//    public static Mat getDepthMat() {return depthMat;}
//
//    public static Bitmap createBitmapFromMat(Mat mat) {
//        Bitmap bitmap = null;
//        Mat tmp = new Mat(mat.height(), mat.width(), CvType.CV_8U, new Scalar(4));
//        try {
//            Imgproc.cvtColor(mat, tmp, Imgproc.COLOR_GRAY2RGBA, 4);
//            bitmap = Bitmap.createBitmap(tmp.cols(), tmp.rows(), Bitmap.Config.ARGB_8888);
//            Utils.matToBitmap(tmp, bitmap);
//        } catch (CvException e) {
//            Log.d("Exception", e.getMessage());
//        }
//
//        return bitmap;
//    }
//
//    public static Mat createMatFromBitmap(Bitmap bitmap) {
////        Mat mat = new Mat();
//        Mat mat = new Mat(bitmap.getHeight(), bitmap.getWidth(), CvType.CV_8UC1);
//        Bitmap bmp32 = bitmap.copy(Bitmap.Config.ARGB_8888, true);
//        Utils.bitmapToMat(bmp32, mat);
//
//        return mat;
//    }
//
//    public static Mat createMatFromAssets(Context context, String filename) {
//        AssetManager manager = context.getAssets();
//        Bitmap bitmap;
//        Mat mat = null;
//        try {
//            bitmap = BitmapFactory.decodeStream(manager.open(filename));
//            mat = ApplicationManager.createMatFromBitmap(bitmap);
//
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//        return mat;
//    }

    public static String findApkFile(String filepath, Context context) {
        // Get the offset and length for the file: theUrl, that is in your
        // assets folder O
        AssetManager assetManager = context.getAssets();
        try {

            AssetFileDescriptor assFD = assetManager.openFd(filepath);
            if (assFD != null) {
                long fileSize = assFD.getLength();
                long offset = assFD.getStartOffset();
                assFD.close();
                Log.w(TAG, String.format("FileSize: %d, Offset: %d", fileSize, offset));
                // **** offset and fileSize are the offset and size
                // **** in bytes of the asset inside the APK
            }
        } catch (IOException e) {
            Log.w(TAG, e.getMessage());
        }

        Future<String> future = executorService.submit(new LoadTextCallable(context, filepath));
        try {
            return future.get();

        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return null;
    }

    static class LoadTextCallable implements Callable<String> {
        Context context;
        String filepath;
        public LoadTextCallable(Context context, String filepath) {
            this.context = context;
            this.filepath = filepath;
        }

        @Override
        public String call() throws Exception {
            StringBuilder buf = new StringBuilder();
            InputStream inputStream = null;
            try {
                inputStream = context.getAssets().open(filepath);
                BufferedReader in = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
                String str;

                while ((str = in.readLine()) != null) {
                    buf.append(str).append("\n");
                }

                Log.w(TAG, buf.toString());
                in.close();
            } catch (IOException e) {
                e.printStackTrace();
            }

            return buf.toString();
        }
    }
}
