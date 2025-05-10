
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
            android.widget.Toast.makeText(this, "يرجى السماح باستخدام الكاميرا لتمكين مسح الباركود", android.widget.Toast.LENGTH_LONG).show();
            
            // التحقق إذا كان المستخدم رفض الإذن مسبقًا لعرض شرح
            if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.CAMERA)) {
                Log.d(TAG, "requestCameraPermission: عرض شرح للمستخدم حول أهمية الإذن");
                
                android.widget.Toast.makeText(
                    this, 
                    "تحتاج التطبيق إلى إذن الكاميرا لمسح الباركود. يرجى الموافقة على الإذن في النافذة التالية.", 
                    android.widget.Toast.LENGTH_LONG
                ).show();
            }
            
            // طلب الإذن بشكل واضح
            String[] permissions;
            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P) {
                permissions = new String[] {
                    Manifest.permission.CAMERA,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                };
            } else {
                permissions = new String[] {
                    Manifest.permission.CAMERA
                };
            }
            
            ActivityCompat.requestPermissions(
                this,
                permissions,
                CAMERA_PERMISSION_REQUEST_CODE
            );
        } else {
            Log.d(TAG, "requestCameraPermission: إذن الكاميرا ممنوح بالفعل");
            // يمكن إضافة تسجيل إضافي هنا لتأكيد منح الإذن
            logCameraPermissionStatus();
        }
    }
    
    /**
     * تسجيل حالة إذن الكاميرا للتشخيص
     */
    private void logCameraPermissionStatus() {
        boolean hasPermission = ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
        Log.d(TAG, "حالة إذن الكاميرا: " + (hasPermission ? "ممنوح" : "غير ممنوح"));
        
        // يمكننا أيضًا فحص الأذونات الأخرى ذات الصلة
        boolean hasWriteStorage = ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
        boolean hasReadStorage = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
        
        Log.d(TAG, "إذن الكتابة على التخزين: " + (hasWriteStorage ? "ممنوح" : "غير ممنوح"));
        Log.d(TAG, "إذن القراءة من التخزين: " + (hasReadStorage ? "ممنوح" : "غير ممنوح"));
    }
    
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
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
                android.widget.Toast.makeText(this, "تم منح إذن الكاميرا بنجاح!", android.widget.Toast.LENGTH_SHORT).show();
                
                // تسجيل حالة الإذن بعد المنح
                logCameraPermissionStatus();
            } else {
                Log.d(TAG, "onRequestPermissionsResult: تم رفض إذن الكاميرا");
                android.widget.Toast.makeText(this, "تم رفض إذن الكاميرا. بعض الميزات قد لا تعمل بشكل صحيح.", android.widget.Toast.LENGTH_LONG).show();
                
                // إذا تم الرفض بشكل دائم، اقترح على المستخدم الذهاب إلى الإعدادات
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
                    !ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.CAMERA)) {
                    Log.d(TAG, "onRequestPermissionsResult: تم الرفض بشكل دائم، اقتراح فتح الإعدادات");
                    
                    // عرض رسالة أكثر وضوحًا
                    android.app.AlertDialog.Builder builder = new android.app.AlertDialog.Builder(this);
                    builder.setTitle("إذن الكاميرا مطلوب");
                    builder.setMessage("لقد قمت برفض إذن الكاميرا بشكل دائم. " +
                                      "لتمكين مسح الباركود، يرجى فتح إعدادات التطبيق وتفعيل إذن الكاميرا يدويًا.");
                    
                    builder.setPositiveButton("فتح الإعدادات", (dialog, which) -> {
                        openAppSettings();
                    });
                    
                    builder.setNegativeButton("لاحقًا", (dialog, which) -> {
                        dialog.dismiss();
                    });
                    
                    builder.show();
                } else {
                    // إذا لم يتم الرفض بشكل دائم، يمكن طلب الإذن مرة أخرى لاحقًا
                    android.widget.Toast.makeText(
                        this,
                        "لتمكين مسح الباركود، يرجى منح إذن الكاميرا عند طلبه مرة أخرى",
                        android.widget.Toast.LENGTH_LONG
                    ).show();
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
                android.widget.Toast.makeText(this, "تم منح إذن الكاميرا بنجاح!", android.widget.Toast.LENGTH_SHORT).show();
                
                // تسجيل حالة الإذن بعد المنح
                logCameraPermissionStatus();
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
