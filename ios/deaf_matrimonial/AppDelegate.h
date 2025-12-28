#import <UIKit/UIKit.h>
#import <React/RCTBridgeDelegate.h>
#import <UserNotifications/UserNotifications.h> // ✅ Add this

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate> // ✅ Add delegate

@property (nonatomic, strong) UIWindow *window;

@end
