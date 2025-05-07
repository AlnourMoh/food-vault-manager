
package app.lovable.foodvault.manager;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import androidx.core.app.ActivityCompat;

public class MainActivity extends BridgeActivity {
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 100;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // تسجيل التطبيق والطلب المبكر لإذن الكاميرا للمساعدة في الظهور ضمن قائمة التطبيقات في الإعدادات
        registerApp();
    }

    private void registerApp() {
        // طلب إذن الكاميرا مبكراً لضمان ظهور التطبيق في قائمة الكاميرا حتى لو رفض المستخدم
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.CAMERA},
                    CAMERA_PERMISSION_REQUEST_CODE
                );
            }
        }
    }
    
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        // معالجة نتيجة طلب الإذن - لا نهتم بالنتيجة هنا، فقط نحتاج طلب الإذن مبكراً
        // لضمان تسجيل التطبيق في النظام وظهوره في قائمة الإعدادات
        if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            // تم طلب الإذن - سيظهر التطبيق الآن في قائمة الكاميرا بغض النظر عن موافقة المستخدم
        }
    }
}
