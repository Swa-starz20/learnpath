package com.learnpath.search.controller;

import com.learnpath.common.response.ApiResponse;
import com.learnpath.search.dto.SearchResultGroup;
import com.learnpath.search.service.SearchService;
import com.learnpath.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SearchResultGroup>> search(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("q") String query) {
        SearchResultGroup results = searchService.search(principal.getId(), query);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }
}
