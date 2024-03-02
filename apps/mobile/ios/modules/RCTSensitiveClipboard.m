// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

#import "RCTSensitiveClipboard.h"

#import <UIKit/UIKit.h>

@implementation RCTSensitiveClipboard

RCT_EXPORT_MODULE();

/// Sets {content} into the clipboard for {duration} seconds.
///
/// - Parameters:
///   - content: The string to be put into the clipboard
///   - duration: The seconds before the message expires
- (void) handleSetClipboard:(nonnull NSString*) content duration:(nonnull NSNumber*)duration
{
  UIPasteboard *clipboard = [UIPasteboard generalPasteboard];
  [
    clipboard setItemProviders:@[[[NSItemProvider alloc] initWithObject:(content ?: @"")]]
    localOnly:true
    expirationDate:[NSDate dateWithTimeIntervalSinceNow:duration.doubleValue]
  ];
}

/// Sets {content} into the clipboard and prepares the clipboard to be cleared after {duration} seconds.
///
/// - Parameters:
///   - content: The string to be put into the clipboard
///   - duration: The duration before the clipboard is cleared.
RCT_EXPORT_METHOD(setString:(nonnull NSString *)content duration:(nonnull NSNumber *)duration)
{
  [self handleSetClipboard: content duration:duration];
}

@end
