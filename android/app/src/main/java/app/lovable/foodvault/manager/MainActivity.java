
package app.lovable.foodvault.manager;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;
import com.getcapacitor.BridgeActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends BridgeActivity {
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 100;
    private static final int APP_SETTINGS_REQUEST_CODE = 101;
    private static final String TAG = "FoodVaultManager";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // تسجيل تشخيصي - للمساعدة في تحديد المشكلة
        Log.d(TAG, "onCreate: بدء تشغيل التطبيق");
        
        // التحقق من وجود إذن الكاميرا وطلبه فورًا عند بدء التطبيق
        requestCameraPermission();
    }

    /**
     * طلب إذن استخدام الكاميرا بشكل مباشر
     */
    private void requestCameraPermission() {
        // التحقق أولاً مما إذا كان الإذن ممنوحًا بالفعل
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            Log.d(TAG, "requestCameraPermission: طلب إذن الكاميرا مباشرة");
            
            // عرض رسالة للمستخدم
            Toast.makeText(this, "يرجى السماح باستخدام الكاميرا لتمكين مسح الباركود", Toast.LENGTH_LONG).show();
            
            // طلب الإذن
            ActivityCompat.requestPermissions(
                this,
                new String[]{Manifest.permission.CAMERA},
                CAMERA_PERMISSION_REQUEST_CODE
            );
        } else {
            Log.d(TAG, "requestCameraPermission: إذن الكاميرا ممنوح بالفعل");
        }
    }
    
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "onRequestPermissionsResult: تم منح إذن الكاميرا");
                Toast.makeText(this, "تم منح إذن الكاميرا بنجاح!", Toast.LENGTH_SHORT).show();
            } else {
                Log.d(TAG, "onRequestPermissionsResult: تم رفض إذن الكاميرا");
                Toast.makeText(this, "تم رفض إذن الكاميرا. بعض الميزات قد لا تعمل بشكل صحيح.", Toast.LENGTH_LONG).show();
                
                // إذا تم الرفض بشكل دائم، اقترح على المستخدم الذهاب إلى الإعدادات
                if (!ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.CAMERA)) {
                    Log.d(TAG, "onRequestPermissionsResult: تم الرفض بشكل دائم، اقتراح فتح الإعدادات");
                    Toast.makeText(this, "يرجى تمكين إذن الكاميرا من إعدادات التطبيق", Toast.LENGTH_LONG).show();
                    
                    // تأخير قصير قبل فتح الإعدادات للسماح بظهور الرسالة
                    new android.os.Handler().postDelayed(
                        new Runnable() {
                            @Override
                            public void run() {
                                openAppSettings();
                            }
                        },
                        2000 // تأخير لمدة 2 ثانية
                    );
                }
            }
        }
    }
    
    /**
     * فتح صفحة إعدادات التطبيق حيث يمكن للمستخدم تعديل الأذونات
     */
    private void openAppSettings() {
        try {
            Log.d(TAG, "openAppSettings: محاولة فتح إعدادات التطبيق");
            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            Uri uri = Uri.fromParts("package", getPackageName(), null);
            intent.setData(uri);
            startActivityForResult(intent, APP_SETTINGS_REQUEST_CODE);
        } catch (Exception e) {
            Log.e(TAG, "openAppSettings: خطأ في فتح الإعدادات", e);
        }
    }
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == APP_SETTINGS_REQUEST_CODE) {
            // تحقق من الإذن بعد عودة المستخدم من صفحة الإعدادات
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "onActivityResult: تم منح إذن الكاميرا بعد العودة من الإعدادات");
                Toast.makeText(this, "تم منح إذن الكاميرا بنجاح!", Toast.LENGTH_SHORT).show();
            } else {
                Log.d(TAG, "onActivityResult: لا يزال إذن الكاميرا مرفوضًا بعد العودة من الإعدادات");
            }
        }
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        
        // تحقق من إذن الكاميرا في كل مرة يتم فيها استئناف النشاط
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            Log.d(TAG, "onResume: لا يزال إذن الكاميرا مفقودًا");
        } else {
            Log.d(TAG, "onResume: إذن الكاميرا موجود");
        }
    }
}
