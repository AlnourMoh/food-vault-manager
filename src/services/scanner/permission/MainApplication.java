
package app.lovable.foodvault.manager;

import android.app.Application;
import androidx.multidex.MultiDexApplication;

public class MainApplication extends MultiDexApplication {
    @Override
    public void onCreate() {
        super.onCreate();
        // هنا يمكن إضافة أي تهيئة مطلوبة للتطبيق
    }
}
