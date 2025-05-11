
package app.lovable.foodvault.manager;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 100;
    private static final int APP_SETTINGS_REQUEST_CODE = 101;
    private static final String TAG = "FoodVaultManager";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        Log.d(TAG, "onCreate: بدء تشغيل التطبيق");
        
        // عند بدء التشغيل نتحقق مباشرة من وجود إذن الكاميرا كما طلبت
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, CAMERA_PERMISSION_REQUEST_CODE);
            Log.d(TAG, "onCreate: طلب إذن الكاميرا مباشرة عند بدء التطبيق");
        } else {
            Log.d(TAG, "onCreate: إذن الكاميرا ممنوح بالفعل");
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        // نعيد التحقق من أذونات الكاميرا عند العودة إلى التطبيق
        checkAndRequestCameraPermission();
    }

    /**
     * التحقق من وجود إذن استخدام الكاميرا وطلبه إذا لزم الأمر
     */
    private void checkAndRequestCameraPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            Log.d(TAG, "checkAndRequestCameraPermission: لا يوجد إذن للكاميرا، سيتم طلبه");
            
            // إظهار رسالة للمستخدم
            android.widget.Toast.makeText(this, 
                "التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود", 
                android.widget.Toast.LENGTH_LONG).show();

            // طلب الأذونات المطلوبة
            String[] permissions;
            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P) {
                permissions = new String[] {
                    Manifest.permission.CAMERA,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    Manifest.permission.READ_EXTERNAL_STORAGE
                };
            } else if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.S_V2) {
                permissions = new String[] {
                    Manifest.permission.CAMERA,
                    Manifest.permission.READ_EXTERNAL_STORAGE
                };
            } else {
                permissions = new String[] {
                    Manifest.permission.CAMERA,
                    Manifest.permission.READ_MEDIA_IMAGES,
                    Manifest.permission.RECORD_AUDIO
                };
            }
            
            // طلب الأذونات
            ActivityCompat.requestPermissions(
                this,
                permissions,
                CAMERA_PERMISSION_REQUEST_CODE
            );
        } else {
            Log.d(TAG, "checkAndRequestCameraPermission: إذن الكاميرا ممنوح بالفعل");
            
            // إظهار رسالة للتأكيد
            android.widget.Toast.makeText(this, 
                "تم منح إذن الكاميرا بالفعل", 
                android.widget.Toast.LENGTH_SHORT).show();
        }
    }
    
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            boolean cameraPermissionGranted = false;
            
            // التحقق من نتائج طلب الإذن
            if (grantResults.length > 0) {
                for (int i = 0; i < permissions.length; i++) {
                    String permission = permissions[i];
                    int grantResult = grantResults[i];
                    
                    if (permission.equals(Manifest.permission.CAMERA)) {
                        cameraPermissionGranted = (grantResult == PackageManager.PERMISSION_GRANTED);
                        Log.d(TAG, "onRequestPermissionsResult: إذن الكاميرا " + (cameraPermissionGranted ? "ممنوح" : "مرفوض"));
                    }
                }
            }
            
            if (cameraPermissionGranted) {
                Log.d(TAG, "onRequestPermissionsResult: تم منح إذن الكاميرا");
                
                android.widget.Toast.makeText(this, 
                    "تم منح إذن الكاميرا بنجاح!", 
                    android.widget.Toast.LENGTH_SHORT).show();
                
                // إرسال بث محلي للتطبيق يفيد بأن الإذن تم منحه
                sendBroadcast(new Intent("app.lovable.foodvault.manager.CAMERA_PERMISSION_GRANTED"));
            } else {
                Log.d(TAG, "onRequestPermissionsResult: تم رفض إذن الكاميرا");
                
                // إظهار رسالة للمستخدم وتوجيهه إلى الإعدادات
                android.widget.Toast.makeText(this, 
                    "لا يمكن استخدام الماسح الضوئي بدون إذن الكاميرا. يرجى تمكينه من إعدادات التطبيق", 
                    android.widget.Toast.LENGTH_LONG).show();
                
                // عرض مربع حوار لفتح إعدادات التطبيق
                android.app.AlertDialog.Builder builder = new android.app.AlertDialog.Builder(this);
                builder.setTitle("إذن مطلوب")
                    .setMessage("التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود. هل تريد فتح إعدادات التطبيق لتمكين الإذن؟")
                    .setPositiveButton("فتح الإعدادات", (dialog, which) -> openAppSettings())
                    .setNegativeButton("لاحقاً", (dialog, which) -> dialog.dismiss())
                    .show();
            }
        }
    }
    
    /**
     * فتح إعدادات التطبيق لتمكين الأذونات
     */
    private void openAppSettings() {
        Intent intent = new Intent();
        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        Uri uri = Uri.fromParts("package", getPackageName(), null);
        intent.setData(uri);
        startActivityForResult(intent, APP_SETTINGS_REQUEST_CODE);
    }
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == APP_SETTINGS_REQUEST_CODE) {
            // عند العودة من إعدادات التطبيق، نتحقق من حالة الأذونات مرة أخرى
            checkAndRequestCameraPermission();
        }
    }
}
