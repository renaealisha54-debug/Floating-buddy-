public class FloatingBuddyService extends Service {
    private WindowManager windowManager;
    private View floatingView;

    @Override
    public void onCreate() {
        super.onCreate();
        // 1. Inflate the buddy layout
        floatingView = LayoutInflater.from(this).inflate(R.layout.layout_floating_buddy, null);

        // 2. Set layout parameters for "Always on Top"
        final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY, // Required for Android 8+
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT);

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        windowManager.addView(floatingView, params);

        // 3. Add Drag logic here...
    }
}

