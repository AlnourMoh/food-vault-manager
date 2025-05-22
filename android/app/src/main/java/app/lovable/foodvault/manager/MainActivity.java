
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
        
        // Log diagnostic info - to help identify issues
        Log.d(TAG, "onCreate: Starting application");
        
        // Check and request camera permission immediately when app starts
        requestCameraPermission();
    }

    /**
     * Request camera permission directly
     */
    private void requestCameraPermission() {
        // Check if permission is already granted
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            Log.d(TAG, "requestCameraPermission: Requesting camera permission directly");
            
            // Show message to user
            Toast.makeText(this, "Please allow camera access to enable barcode scanning", Toast.LENGTH_LONG).show();

            // Request permission explicitly
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
            Log.d(TAG, "requestCameraPermission: Camera permission is already granted");
            logCameraPermissionStatus();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            boolean cameraPermissionGranted = false;
            
            // Check if camera permission was granted
            for (int i = 0; i < permissions.length; i++) {
                if (permissions[i].equals(Manifest.permission.CAMERA) && 
                    grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                    cameraPermissionGranted = true;
                    break;
                }
            }
            
            if (cameraPermissionGranted) {
                Log.d(TAG, "Camera permission granted by user");
                Toast.makeText(this, "Camera permission granted", Toast.LENGTH_SHORT).show();
            } else {
                Log.d(TAG, "Camera permission denied by user");
                Toast.makeText(this, "Camera permission denied. App needs camera access to scan barcodes.", Toast.LENGTH_LONG).show();
                
                // If permission is denied more than once, direct user to app settings
                if (!ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.CAMERA)) {
                    Log.d(TAG, "User selected 'Don't ask again', directing to settings");
                    Toast.makeText(this, "Please enable camera permission in app settings", Toast.LENGTH_LONG).show();
                    
                    // Open app settings
                    Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                    Uri uri = Uri.fromParts("package", getPackageName(), null);
                    intent.setData(uri);
                    startActivityForResult(intent, APP_SETTINGS_REQUEST_CODE);
                }
            }
        }
    }
    
    /**
     * Log camera permission status for diagnostics
     */
    private void logCameraPermissionStatus() {
        boolean hasPermission = ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
        Log.d(TAG, "Camera permission status: " + (hasPermission ? "granted" : "not granted"));
        
        // We can also check other related permissions
        boolean hasWriteStorage = ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
        boolean hasReadStorage = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
        
        Log.d(TAG, "Storage permissions - Write: " + hasWriteStorage + ", Read: " + hasReadStorage);
    }
}
