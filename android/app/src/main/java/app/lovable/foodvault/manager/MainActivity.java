
package app.lovable.foodvault.manager;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import com.getcapacitor.BridgeActivity;
import androidx.core.app.ActivityCompat;

public class MainActivity extends BridgeActivity {
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 100;
    private static final int APP_SETTINGS_REQUEST_CODE = 101;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // تسجيل التطبيق وطلب المبكر لإذن الكاميرا للمساعدة في الظهور ضمن قائمة التطبيقات في الإعدادات
        registerApp();
    }

    private void registerApp() {
        // طلب أذونات متعددة لضمان ظهور التطبيق في قائمة الإعدادات
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String[] permissions = {
                Manifest.permission.CAMERA,
                Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.READ_MEDIA_IMAGES
            };

            if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    this,
                    permissions,
                    CAMERA_PERMISSION_REQUEST_CODE
                );
            }
        }
        
        // محاولة تسجيل التطبيق مباشرة في إعدادات Android
        try {
            Intent intent = new Intent();
            intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            Uri uri = Uri.fromParts("package", getPackageName(), null);
            intent.setData(uri);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
            intent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
            // لا نقوم بتشغيل هذه النية الآن، لكن مجرد تحضيرها قد يساعد في التسجيل
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        // معالجة نتيجة طلب الإذن بشكل أكثر تفصيلاً
        if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            boolean allGranted = true;
            
            for (int result : grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }
            
            if (!allGranted) {
                // يمكن للمستخدم فتح إعدادات التطبيق يدويًا من هنا إذا لزم الأمر
                // openAppSettings();
            }
        }
    }
    
    /**
     * فتح صفحة إعدادات التطبيق حيث يمكن للمستخدم تعديل الأذونات
     */
    private void openAppSettings() {
        try {
            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            Uri uri = Uri.fromParts("package", getPackageName(), null);
            intent.setData(uri);
            startActivityForResult(intent, APP_SETTINGS_REQUEST_CODE);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == APP_SETTINGS_REQUEST_CODE) {
            // تحقق من الإذن بعد عودة المستخدم من صفحة الإعدادات
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                    // تم منح الإذن
                }
            }
        }
    }
}
