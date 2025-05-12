
package app.lovable.foodvault.manager;

import android.app.Application;
import android.os.Bundle;
import android.util.Log;

import androidx.multidex.MultiDexApplication;

public class MainApplication extends MultiDexApplication {
    private static final String TAG = "FoodVaultManager";

    @Override
    public void onCreate() {
        super.onCreate();
        
        // تسجيل بدء تشغيل التطبيق في السجلات
        Log.d(TAG, "تطبيق FoodVault Manager بدأ التشغيل");
        
        // تسجيل معلومات عن الجهاز والأذونات
        logDeviceInfo();
        
        // إضافة المزيد من التهيئة حسب الحاجة
        initializeComponents();
    }
    
    private void logDeviceInfo() {
        try {
            Log.d(TAG, "معلومات الجهاز والأذونات:");
            Log.d(TAG, "---------------------------------------");
            Log.d(TAG, "إصدار Android: " + android.os.Build.VERSION.RELEASE);
            Log.d(TAG, "طراز الجهاز: " + android.os.Build.MODEL);
            Log.d(TAG, "الشركة المصنعة: " + android.os.Build.MANUFACTURER);
            
            // فحص حالة أذونات الكاميرا
            int cameraPermission = checkSelfPermission(android.Manifest.permission.CAMERA);
            Log.d(TAG, "حالة أذن الكاميرا: " + (cameraPermission == android.content.pm.PackageManager.PERMISSION_GRANTED ? "ممنوح" : "غير ممنوح"));
            
            Log.d(TAG, "---------------------------------------");
        } catch (Exception e) {
            Log.e(TAG, "خطأ أثناء تسجيل معلومات الجهاز", e);
        }
    }
    
    private void initializeComponents() {
        try {
            // تسجيل أن عملية التهيئة بدأت
            Log.d(TAG, "بدء تهيئة مكونات التطبيق");
            
            // تحقق من توفر مكتبات المسح الضوئي
            try {
                boolean mlkitAvailable = getPackageManager().hasSystemFeature(android.content.pm.PackageManager.FEATURE_CAMERA);
                Log.d(TAG, "توفر الكاميرا: " + mlkitAvailable);
                
                // محاولة تحميل فئات MLKit للتأكد من توفرها
                Class.forName("com.google.mlkit.vision.barcode.BarcodeScanner");
                Log.d(TAG, "مكتبة MLKit متاحة");
            } catch (Exception e) {
                Log.w(TAG, "مكتبة MLKit غير متاحة: " + e.getMessage());
            }
            
            // إضافة المزيد من التهيئة حسب الحاجة
            
            // تسجيل أن عملية التهيئة اكتملت
            Log.d(TAG, "اكتملت تهيئة مكونات التطبيق بنجاح");
        } catch (Exception e) {
            // تسجيل أي أخطاء تحدث أثناء التهيئة
            Log.e(TAG, "حدث خطأ أثناء تهيئة مكونات التطبيق", e);
        }
    }
}
