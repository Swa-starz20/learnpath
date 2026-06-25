package com.learnpath.notification.controller;

import com.learnpath.common.response.ApiResponse;
import com.learnpath.notification.dto.NotificationDeliveryLogResponse;
import com.learnpath.notification.dto.NotificationPreferenceResponse;
import com.learnpath.notification.dto.NotificationResponse;
import com.learnpath.notification.dto.UpdateNotificationPreferenceRequest;
import com.learnpath.notification.service.NotificationIntelligenceService;
import com.learnpath.notification.service.NotificationService;
import com.learnpath.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationIntelligenceService notificationIntelligenceService;

    public NotificationController(NotificationService notificationService,
                                  NotificationIntelligenceService notificationIntelligenceService) {
        this.notificationService = notificationService;
        this.notificationIntelligenceService = notificationIntelligenceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getLatestNotifications(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<NotificationResponse> latest = notificationService.getLatestNotifications(principal.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(latest));
    }

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUnreadNotifications(@AuthenticationPrincipal UserPrincipal principal) {
        List<NotificationResponse> unread = notificationService.getUnreadNotifications(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(unread));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(@AuthenticationPrincipal UserPrincipal principal) {
        long count = notificationService.getUnreadCount(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(Map.of("unreadCount", count)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        NotificationResponse response = notificationService.markAsRead(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal UserPrincipal principal) {
        notificationService.markAllAsRead(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(null, "All notifications marked as read."));
    }

    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse<NotificationPreferenceResponse>> getPreferences(@AuthenticationPrincipal UserPrincipal principal) {
        NotificationPreferenceResponse preferences = notificationService.getPreferences(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(preferences));
    }

    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<NotificationPreferenceResponse>> updatePreferences(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateNotificationPreferenceRequest request) {
        NotificationPreferenceResponse response = notificationService.updatePreferences(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/delivery-log")
    public ResponseEntity<ApiResponse<List<NotificationDeliveryLogResponse>>> getDeliveryLog(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<NotificationDeliveryLogResponse> history = notificationIntelligenceService.getDeliveryHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(history));
    }
}
