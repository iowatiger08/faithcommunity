"use strict";
(self["webpackChunkfaithcommunity"] = self["webpackChunkfaithcommunity"] || []).push([["main"],{

/***/ 4114:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppRoutingModule: () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _layouts_default_default_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layouts/default/default.component */ 5600);
/* harmony import */ var _modules_about_about_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/about/about.component */ 7914);
/* harmony import */ var _modules_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/dashboard/dashboard.component */ 9786);
/* harmony import */ var _modules_devotional_devotional_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/devotional/devotional.component */ 8422);
/* harmony import */ var _modules_fitness_fitness_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/fitness/fitness.component */ 3066);
/* harmony import */ var _modules_mindfulness_mindfulness_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/mindfulness/mindfulness.component */ 2478);
/* harmony import */ var _modules_outreach_outreach_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/outreach/outreach.component */ 2978);
/* harmony import */ var _modules_statements_statements_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/statements/statements.component */ 348);
/* harmony import */ var _modules_wedding_wedding_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modules/wedding/wedding.component */ 7906);
/* harmony import */ var _modules_word_word_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modules/word/word.component */ 3052);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 7580);













const routes = [{
  path: '',
  component: _layouts_default_default_component__WEBPACK_IMPORTED_MODULE_0__.DefaultComponent,
  children: [{
    path: '',
    component: _modules_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_2__.DashboardComponent
  }, {
    path: 'statements',
    component: _modules_statements_statements_component__WEBPACK_IMPORTED_MODULE_7__.StatementsComponent
  }, {
    path: 'word',
    component: _modules_word_word_component__WEBPACK_IMPORTED_MODULE_9__.WordComponent
  }, {
    path: 'fitness',
    component: _modules_fitness_fitness_component__WEBPACK_IMPORTED_MODULE_4__.FitnessComponent
  }, {
    path: 'devotionals',
    component: _modules_devotional_devotional_component__WEBPACK_IMPORTED_MODULE_3__.DevotionalComponent
  }, {
    path: 'mindfulness',
    component: _modules_mindfulness_mindfulness_component__WEBPACK_IMPORTED_MODULE_5__.MindfulnessComponent
  }, {
    path: 'outreach',
    component: _modules_outreach_outreach_component__WEBPACK_IMPORTED_MODULE_6__.OutreachComponent
  }, {
    path: 'wedding',
    component: _modules_wedding_wedding_component__WEBPACK_IMPORTED_MODULE_8__.WeddingComponent
  }, {
    path: 'about',
    component: _modules_about_about_component__WEBPACK_IMPORTED_MODULE_1__.AboutComponent
  }]
}];
class AppRoutingModule {
  static {
    this.ɵfac = function AppRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AppRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineNgModule"]({
      type: AppRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_11__.RouterModule.forRoot(routes, {}), _angular_router__WEBPACK_IMPORTED_MODULE_11__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_11__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_11__.RouterModule]
  });
})();

/***/ }),

/***/ 92:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 5072);


class AppComponent {
  constructor() {
    this.title = 'dashboard';
  }
  static {
    this.ɵfac = function AppComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AppComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AppComponent,
      selectors: [["app-root"]],
      decls: 1,
      vars: 0,
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterOutlet],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxnS0FBZ0siLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 635:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppModule: () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser */ 436);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 4114);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 92);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser/animations */ 3835);
/* harmony import */ var _layouts_default_default_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./layouts/default/default.module */ 9887);
/* harmony import */ var _modules_word_blogger_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/word/blogger.service */ 6970);
/* harmony import */ var _modules_word_word_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/word/word.module */ 6043);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 7580);








class AppModule {
  static {
    this.ɵfac = function AppModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AppModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineNgModule"]({
      type: AppModule,
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({
      providers: [_modules_word_blogger_service__WEBPACK_IMPORTED_MODULE_3__.BloggerService],
      imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__.BrowserAnimationsModule, _layouts_default_default_module__WEBPACK_IMPORTED_MODULE_2__.DefaultModule, _modules_word_word_module__WEBPACK_IMPORTED_MODULE_4__.WordModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__.BrowserAnimationsModule, _layouts_default_default_module__WEBPACK_IMPORTED_MODULE_2__.DefaultModule, _modules_word_word_module__WEBPACK_IMPORTED_MODULE_4__.WordModule]
  });
})();

/***/ }),

/***/ 5600:
/*!******************************************************!*\
  !*** ./src/app/layouts/default/default.component.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultComponent: () => (/* binding */ DefaultComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _shared_components_header_header_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/components/header/header.component */ 9381);
/* harmony import */ var _shared_components_sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/components/sidebar/sidebar.component */ 1417);
/* harmony import */ var _shared_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/components/footer/footer.component */ 1765);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/sidenav */ 7049);






class DefaultComponent {
  constructor() {
    this.sidebarOpen = true;
  }
  ngOnInit() {}
  sidebarToggler() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  static {
    this.ɵfac = function DefaultComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DefaultComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: DefaultComponent,
      selectors: [["app-default"]],
      decls: 7,
      vars: 1,
      consts: [[3, "toggleSidebarEmitter"], ["mode", "side", 3, "opened"]],
      template: function DefaultComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "app-header", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("toggleSidebarEmitter", function DefaultComponent_Template_app_header_toggleSidebarEmitter_0_listener() {
            return ctx.sidebarToggler();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "mat-drawer-container")(2, "mat-drawer", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "app-sidebar");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "mat-drawer-content");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](5, "router-outlet");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](6, "app-footer");
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("opened", ctx.sidebarOpen);
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterOutlet, _shared_components_header_header_component__WEBPACK_IMPORTED_MODULE_0__.HeaderComponent, _shared_components_sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_1__.SidebarComponent, _shared_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_2__.FooterComponent, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_5__.MatDrawer, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_5__.MatDrawerContainer, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_5__.MatDrawerContent],
      styles: ["[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\nmat-drawer[_ngcontent-%COMP%] {\n  width: 275px;\n  background-color: rgb(137, 129, 129);\n}\n\nmat-drawer-container[_ngcontent-%COMP%] {\n  height: 100%;\n}\n\nmat-drawer-content[_ngcontent-%COMP%] {\n  padding: 10px;\n}\n\nmat-card[_ngcontent-%COMP%] {\n  padding: 10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxZQUFBO0FBQ0Y7O0FBRUE7RUFDRSxZQUFBO0VBQ0Esb0NBQUE7QUFDRjs7QUFFQTtFQUNFLFlBQUE7QUFDRjs7QUFFQTtFQUNFLGFBQUE7QUFDRjs7QUFFQTtFQUNFLGFBQUE7QUFDRiIsImZpbGUiOiJkZWZhdWx0LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbm1hdC1kcmF3ZXIge1xuICB3aWR0aDogMjc1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxMzcsIDEyOSwgMTI5KTtcbn1cblxubWF0LWRyYXdlci1jb250YWluZXIge1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbm1hdC1kcmF3ZXItY29udGVudCB7XG4gIHBhZGRpbmc6IDEwcHg7XG59XG5cbm1hdC1jYXJke1xuICBwYWRkaW5nOiAxMHB4O1xufVxuXG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0cy9kZWZhdWx0L2RlZmF1bHQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxZQUFBO0FBQ0Y7O0FBRUE7RUFDRSxZQUFBO0VBQ0Esb0NBQUE7QUFDRjs7QUFFQTtFQUNFLFlBQUE7QUFDRjs7QUFFQTtFQUNFLGFBQUE7QUFDRjs7QUFFQTtFQUNFLGFBQUE7QUFDRjtBQUNBLHd3QkFBd3dCIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbm1hdC1kcmF3ZXIge1xuICB3aWR0aDogMjc1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxMzcsIDEyOSwgMTI5KTtcbn1cblxubWF0LWRyYXdlci1jb250YWluZXIge1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbm1hdC1kcmF3ZXItY29udGVudCB7XG4gIHBhZGRpbmc6IDEwcHg7XG59XG5cbm1hdC1jYXJke1xuICBwYWRkaW5nOiAxMHB4O1xufVxuXG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 9887:
/*!***************************************************!*\
  !*** ./src/app/layouts/default/default.module.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultModule: () => (/* binding */ DefaultModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _default_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./default.component */ 5600);
/* harmony import */ var src_app_modules_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/modules/dashboard/dashboard.component */ 9786);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var src_app_modules_statements_statements_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/modules/statements/statements.component */ 348);
/* harmony import */ var src_app_shared_shared_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/shared.module */ 3887);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/sidenav */ 7049);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/divider */ 4102);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/table */ 7697);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/card */ 3777);
/* harmony import */ var _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/datepicker */ 1977);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/form-field */ 4950);
/* harmony import */ var src_app_modules_fitness_fitness_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/modules/fitness/fitness.component */ 3066);
/* harmony import */ var src_app_modules_mindfulness_mindfulness_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/modules/mindfulness/mindfulness.component */ 2478);
/* harmony import */ var src_app_modules_outreach_outreach_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/modules/outreach/outreach.component */ 2978);
/* harmony import */ var src_app_modules_wedding_wedding_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/modules/wedding/wedding.component */ 7906);
/* harmony import */ var src_app_modules_devotional_devotional_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/modules/devotional/devotional.component */ 8422);
/* harmony import */ var src_app_modules_about_about_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/app/modules/about/about.component */ 7914);
/* harmony import */ var src_app_modules_word_word_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/app/modules/word/word.module */ 6043);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 7580);




















class DefaultModule {
  static {
    this.ɵfac = function DefaultModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DefaultModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineNgModule"]({
      type: DefaultModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_13__.RouterModule, src_app_shared_shared_module__WEBPACK_IMPORTED_MODULE_3__.SharedModule, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_14__.MatSidenavModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_15__.MatDividerModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_16__.MatTableModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_17__.MatCardModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_18__.MatDatepickerModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_19__.MatFormFieldModule, src_app_modules_word_word_module__WEBPACK_IMPORTED_MODULE_10__.WordModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsetNgModuleScope"](DefaultModule, {
    declarations: [_default_component__WEBPACK_IMPORTED_MODULE_0__.DefaultComponent, src_app_modules_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_1__.DashboardComponent, src_app_modules_statements_statements_component__WEBPACK_IMPORTED_MODULE_2__.StatementsComponent, src_app_modules_fitness_fitness_component__WEBPACK_IMPORTED_MODULE_4__.FitnessComponent, src_app_modules_mindfulness_mindfulness_component__WEBPACK_IMPORTED_MODULE_5__.MindfulnessComponent, src_app_modules_outreach_outreach_component__WEBPACK_IMPORTED_MODULE_6__.OutreachComponent, src_app_modules_wedding_wedding_component__WEBPACK_IMPORTED_MODULE_7__.WeddingComponent, src_app_modules_devotional_devotional_component__WEBPACK_IMPORTED_MODULE_8__.DevotionalComponent, src_app_modules_about_about_component__WEBPACK_IMPORTED_MODULE_9__.AboutComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_13__.RouterModule, src_app_shared_shared_module__WEBPACK_IMPORTED_MODULE_3__.SharedModule, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_14__.MatSidenavModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_15__.MatDividerModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_16__.MatTableModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_17__.MatCardModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_18__.MatDatepickerModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_19__.MatFormFieldModule, src_app_modules_word_word_module__WEBPACK_IMPORTED_MODULE_10__.WordModule, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgOptimizedImage]
  });
})();

/***/ }),

/***/ 7914:
/*!**************************************************!*\
  !*** ./src/app/modules/about/about.component.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AboutComponent: () => (/* binding */ AboutComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/card */ 3777);


class AboutComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function AboutComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AboutComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AboutComponent,
      selectors: [["app-about"]],
      decls: 31,
      vars: 0,
      template: function AboutComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div")(1, "mat-card")(2, "h1");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Faith Community Church");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, " (a Hope and Truth Ministry)");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, " Are you in a wilderness?? Not sure what path to take? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " Faith Community ministry dedicated to faith, hope and love that spans cultures, sacred ideas and provides direction to promote wellness and healing of spirit, body and mind in the many ways our Creator gifts us. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "mat-card")(11, "mat-card-header")(12, "h3");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Mission & Vision");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "mat-card-content");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, " The Faith Community Church mission is to provide a truly welcoming, open and affirming ministry to all people seeking divine wisdom, no matter where one is on life\u2019s journey We are committed to theology that affirms the gospel teachings and wisdom that affirms differences (rather than rejecting them) in how people come to our higher power and how people believe in the Creator and sustainer of all life. This church community values equity, access, fairness and positive ideals - leaving judgment to that Creator. Thus, we serve the community in capacities that enrich lives and advocate for causes in the way the Spirit teaches us in the Gospels and the many great wisdoms around the world who share in the universal justice and truth. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, " We believe our purpose is to: ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "ul")(19, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "grow in love of the Holy Presence and of all our Neighbors,");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, " provide a safe, sacred and faith-respective atmosphere though abundant welcoming and love of that Creator revealed in us, ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, " promote, through advocacy and education positive and social awareness of issues and collective vision to the congregation and outreach to the community, ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, " be an advocate for equal civil rights, diversity, enabled society, and social justice, ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, " advocate for commonality and interfaith relations with non-traditional Christian teachings, ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, " participate and develop coalitions with other organizations that foster social justice, the Gospels, and good citizenry. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        }
      },
      dependencies: [_angular_material_card__WEBPACK_IMPORTED_MODULE_1__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_1__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_1__.MatCardHeader],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhYm91dC5jb21wb25lbnQuc2NzcyJ9 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hYm91dC9hYm91dC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsZ0tBQWdLIiwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 9786:
/*!**********************************************************!*\
  !*** ./src/app/modules/dashboard/dashboard.component.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DashboardComponent: () => (/* binding */ DashboardComponent)
/* harmony export */ });
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material/table */ 7697);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/card */ 3777);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 316);




const ELEMENT_DATA = [{
  position: 1,
  name: 'Hydrogen',
  weight: 1.0079,
  symbol: 'H'
}, {
  position: 2,
  name: 'Helium',
  weight: 4.0026,
  symbol: 'He'
}, {
  position: 3,
  name: 'Lithium',
  weight: 6.941,
  symbol: 'Li'
}, {
  position: 4,
  name: 'Beryllium',
  weight: 9.0122,
  symbol: 'Be'
}, {
  position: 5,
  name: 'Boron',
  weight: 10.811,
  symbol: 'B'
}, {
  position: 6,
  name: 'Carbon',
  weight: 12.0107,
  symbol: 'C'
}, {
  position: 7,
  name: 'Nitrogen',
  weight: 14.0067,
  symbol: 'N'
}, {
  position: 8,
  name: 'Oxygen',
  weight: 15.9994,
  symbol: 'O'
}, {
  position: 9,
  name: 'Fluorine',
  weight: 18.9984,
  symbol: 'F'
}, {
  position: 10,
  name: 'Neon',
  weight: 20.1797,
  symbol: 'Ne'
}];
class DashboardComponent {
  constructor() {
    this.displayedColumns = ['position', 'name', 'weight', 'symbol'];
    this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_0__.MatTableDataSource(ELEMENT_DATA);
    this.clickedRows = new Set();
  }
  ngOnInit() {}
  static {
    this.ɵfac = function DashboardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DashboardComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: DashboardComponent,
      selectors: [["app-dashboard"]],
      decls: 19,
      vars: 0,
      consts: [["ngSrc", "assets/img/minnesota_2020.jpg", "alt", "wilderness", "height", "1331", "width", "998"]],
      template: function DashboardComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div")(1, "mat-card")(2, "h1");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Faith Community Church");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, " (a Hope and Truth Ministry)");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "br")(6, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, " Create in me a clean heart, O God, and put a new and right spirit within me. Psalm 51:10 (NRSV)");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, " May the words of my mouth and the meditations of all of our hearts be acceptable in Your sight. adapted from Psalm 19 (NRSV)");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](10, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, " Thank you for visiting!");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, " Are you in a wilderness?? Not sure what path to take? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](15, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, " Faith Community ministry dedicated to faith, hope and love that spans cultures, sacred ideas and provides direction to promote wellness and healing of spirit, body and mind in the many ways our Creator gifts us. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](18, "img", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        }
      },
      dependencies: [_angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCard, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgOptimizedImage],
      styles: [".demo-table[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.mat-row[_ngcontent-%COMP%]   .mat-cell[_ngcontent-%COMP%] {\n  border-bottom: 1px solid transparent;\n  border-top: 1px solid transparent;\n  cursor: pointer;\n}\n\n.mat-row[_ngcontent-%COMP%]:hover   .mat-cell[_ngcontent-%COMP%] {\n  border-color: currentColor;\n}\n\n.demo-row-is-clicked[_ngcontent-%COMP%] {\n  font-weight: bold;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhc2hib2FyZC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFdBQUE7QUFDRjs7QUFFQTtFQUNFLG9DQUFBO0VBQ0EsaUNBQUE7RUFDQSxlQUFBO0FBQ0Y7O0FBRUE7RUFDRSwwQkFBQTtBQUNGOztBQUVBO0VBQ0UsaUJBQUE7QUFDRiIsImZpbGUiOiJkYXNoYm9hcmQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZGVtby10YWJsZSB7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4ubWF0LXJvdyAubWF0LWNlbGwge1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4ubWF0LXJvdzpob3ZlciAubWF0LWNlbGwge1xuICBib3JkZXItY29sb3I6IGN1cnJlbnRDb2xvcjtcbn1cblxuLmRlbW8tcm93LWlzLWNsaWNrZWQge1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9kYXNoYm9hcmQvZGFzaGJvYXJkLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsV0FBQTtBQUNGOztBQUVBO0VBQ0Usb0NBQUE7RUFDQSxpQ0FBQTtFQUNBLGVBQUE7QUFDRjs7QUFFQTtFQUNFLDBCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxpQkFBQTtBQUNGO0FBQ0Esb3VCQUFvdUIiLCJzb3VyY2VzQ29udGVudCI6WyIuZGVtby10YWJsZSB7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4ubWF0LXJvdyAubWF0LWNlbGwge1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4ubWF0LXJvdzpob3ZlciAubWF0LWNlbGwge1xuICBib3JkZXItY29sb3I6IGN1cnJlbnRDb2xvcjtcbn1cblxuLmRlbW8tcm93LWlzLWNsaWNrZWQge1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 8422:
/*!************************************************************!*\
  !*** ./src/app/modules/devotional/devotional.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DevotionalComponent: () => (/* binding */ DevotionalComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/divider */ 4102);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/card */ 3777);



class DevotionalComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function DevotionalComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DevotionalComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: DevotionalComponent,
      selectors: [["app-devotional"]],
      decls: 18,
      vars: 0,
      consts: [["href", "https://cac.org/daily-meditations/"], ["href", "https://www.luthersem.edu/godpause/"]],
      template: function DevotionalComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div")(1, "h2");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Devotionals ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "mat-card")(4, "mat-card-title");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, " Daily inspiration ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "mat-card-content")(7, "a", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Richard Rohr's Center for Contemplative Prayer");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "a", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "God Pause from Luther Seminary");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "br")(13, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](14, "mat-card-footer");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "mat-divider");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, " Listen for the still speaking Spirit, giver of life and holy presence\n");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        }
      },
      dependencies: [_angular_material_divider__WEBPACK_IMPORTED_MODULE_1__.MatDivider, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardFooter, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardTitle],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJkZXZvdGlvbmFsLmNvbXBvbmVudC5zY3NzIn0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9kZXZvdGlvbmFsL2Rldm90aW9uYWwuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHdLQUF3SyIsInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 3066:
/*!******************************************************!*\
  !*** ./src/app/modules/fitness/fitness.component.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FitnessComponent: () => (/* binding */ FitnessComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/divider */ 4102);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/card */ 3777);



class FitnessComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function FitnessComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || FitnessComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: FitnessComponent,
      selectors: [["app-fitness"]],
      decls: 24,
      vars: 0,
      template: function FitnessComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div")(1, "h2");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Fitness and Body Health");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "mat-card")(4, "mat-card-title");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, " Training and health discipline ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "mat-card-content");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, " Meditation");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " Martial arts");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, " Bicycling");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, " Kickboxing");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](14, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, " Circuit Training");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, " Bootcamp Core");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "mat-card-footer");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, " No discipline seems pleasant at the time, but painful. Later on, however, it produces a harvest of righteousness and peace for those who have been trained by it. (Hebrews 12:11) ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](21, "mat-divider");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, " Weekly Meditations | Planned Bike Rides ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        }
      },
      dependencies: [_angular_material_divider__WEBPACK_IMPORTED_MODULE_1__.MatDivider, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardFooter, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardTitle],
      styles: ["mat-card-footer[_ngcontent-%COMP%] {\n  padding: 10px;\n  text-align: right;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpdG5lc3MuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxhQUFBO0VBQ0EsaUJBQUE7QUFDRiIsImZpbGUiOiJmaXRuZXNzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsibWF0LWNhcmQtZm9vdGVye1xuICBwYWRkaW5nOiAxMHB4O1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9maXRuZXNzL2ZpdG5lc3MuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxhQUFBO0VBQ0EsaUJBQUE7QUFDRjtBQUNBLDRWQUE0ViIsInNvdXJjZXNDb250ZW50IjpbIm1hdC1jYXJkLWZvb3RlcntcbiAgcGFkZGluZzogMTBweDtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 2478:
/*!**************************************************************!*\
  !*** ./src/app/modules/mindfulness/mindfulness.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MindfulnessComponent: () => (/* binding */ MindfulnessComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/divider */ 4102);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/card */ 3777);



class MindfulnessComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function MindfulnessComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || MindfulnessComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: MindfulnessComponent,
      selectors: [["app-mindfulness"]],
      decls: 114,
      vars: 0,
      consts: [["src", "assets/img/pathThru_winter.jpg", "alt", "winter"]],
      template: function MindfulnessComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div")(1, "h2");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Mindfulness");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "mat-card")(4, "mat-card-title");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, " Just sit there or walk in peace ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "mat-card-content")(7, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, " When we read versions of the Nicene creed, I am drawn to memory of the way I recited the creed as a profession of faith in the Catholic Mass. I am drawn also to the rosary and how we would use that as a variation of meditative prayer.\u00A0 We say these things over and over in order to foster a sense of reverence, and I can still verbatim recite each prayer and the profession that we learned then.\u00A0 That is a unique way to do meditation by reciting common phrases and prayers -- and a great way to learn them.\u00A0 Since I do not fully subscribe to the Nicene or Apostles Creed these days, I look for other ways that might describe how I believe without being constrained to them.\u00A0 ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, " Today, we turn to the Tao Te Ching and ask which is so important that I would want to incorporate that into my meditation rather than as an empty mind or mindfulness meditation. Since the Nicene creed calls God into being through Jesus Christ and the holy Spirit, I am drawn to particular verses that talks about being born and into being. Let us meditate upon being. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, " 40b");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, " \" Returning to the root is the movement of the Tao.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, " Quietness is how it functions.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, " Ten thousand things are born of being.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](19, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, " Being is born of nonbeing. \" ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, " 42a \" Nonbeing gives birth to the oneness,");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](23, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, " The oneness gives birth to yin and yang.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](25, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, " Yin and yang give birth to heaven, earth, and beings.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](27, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, " Heaven, earth, and beings give birth to everything in existence.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](29, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, " Therefore, everything in existence carries within it both yin and yang,");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](31, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, " and attains harmony by blending these\u2026\" ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, " Meditating on this, I feel the different dimensions of God. Perhaps, others also might feel and see the different dimensions of God working with us and around us as trinity, God and spirit or as spirit or as Jesus. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, " The power of God perhaps can be described, but like the words of the Tao, words cannot contain God. From God, the onenness, \"maker ...of all that is seen and unseen\", we have the spirit, Jesus and beautiful beings in Heaven and Earth. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, " What this tells me in this meditative reflection is that whether Jesus was God incarnate, \" God from God, true light from true light, begotten not made,\" a divine being created by God as an intercession to us, or a person with strong connection to God \"by the power of the Holy Spirit\", Jesus's work here on Earth, \"for our sake... was crucified ...suffered, died...\" is a powerful testament of Truth. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](40, " How do we live out our testament of Truth? That we all are born of and made of the work of God that binds us to the being of God and how we work with each other is important. When I meditate on these, I can feel how God is of the yin and yang as we are in this world that has been gifted to us.\u00A0 ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](41, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, "In fact, Jesus teaches a version of the yin and yang and to find contentment rather than to persist in expectations through the sermon on the plain that we read during the weeks of lectionary in Luke. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, " 51b.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](45, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](46, " Giving birth,");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](47, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, " Nourishing life,");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](49, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, " Shaping things without possessing them,");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](51, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, " Serving without expectation of rewards,");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](53, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](54, " Leading without dominating:");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](55, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](56, " These are the profound virtues of nature,");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](57, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](58, " And of nature's best beings. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](60, " \" Love your enemies, do good and lend, expecting nothing in return. Your reward will be great and you will be the children of the Most High.\" (Luke 6: 35) ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, " Let us be one with the Spirit, \"the giver of life\", that surrounds us and binds us. Let us be profound virtues of nature and expect nothing in return while nourishing life and shaping the world we live with our love . Amen. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](64, " *As translated by Brown Walker, B. (1995). The Tao Te Ching of Lao Tzu. First St. Martin's Griffin Ed: New York. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](66, " Then, Reading the material around Dionysius, it is fitting we might read this on the week of Transfiguration Sunday with such a mystical stories of Jesus and Moses. I again sense Taoism and parts of the Tao Te Ching, but this time, I would like to meditate on the principles of the duality very present in Dionysius work: the opposites as they all form as part of the one.\u00A0 ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](68, "Let our spirit rise and fall with this meditation.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](69, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](70, " From the Book of Chuang Tzu (translated by Martin Palmer p 188)");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](71, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](72, " \" Life Follows death and death is the forerunner of life.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](73, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](74, " Who can know their ways?...");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](75, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](76, " As death and life are together in all this, which can be termed bad? All the forms of life are one\u2026, yet we regard some as beautiful \u2026others as ugly\u2026 but even the diseased and rotting can become the spiritual and wonderful, and the spiritual and wonderful can become the diseased and rotting. \u201C ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](77, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](78, " The mysticism of this weaves with the Dionysius line into this discussion: \u201Coutshining all brilliance with the intensity of their Darkness\u201D and then, \u201Cyet in a ..sense, it does not possess them since it transcends them all;\u201D ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](79, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](80, " Thus, we witness transcendence from left to right and light to dark.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](81, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](82, " We see transcendence from right to left and dark to light;");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](83, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](84, " From death to life and life to death.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](85, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](86, " Out of darkness came light and from light we go to darkness.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](87, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](88, " All are one with the presence of the Holy One, the Divine Wisdom.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](89, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](90, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](91, " And suddenly transfiguration is a transcendence that we can witness in our own lives.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](92, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](93, " With the \"One who is beyond all\", we cannot literally comprehend that infinite image who embodies both the divine light and the Darkness to reveal the naked Truth: that we cannot speak it because we cannot describe it, but we can know it. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](94, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](95, " How do we allow the light and darkness to transcend within us and in our being? How do we reject the perfect light and darkness by our feeble attempt to define its trueness, its being? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](96, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](97, " Spirit of the living God, fall upon us and be with us in all of your splendor and murky ways.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](98, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](99, " Spirit of the One who gives us life and death, be nearer to our understanding and our denials.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](100, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](101, " Reveal to us so we might be able to truly embrace what we cannot describe and allow that to be the naked Truth in our lives. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](102, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](103, " Spirit of the light and the Dark, be far from us so that we might be comforted in your presence.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](104, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](105, " That we may continue yours in no-words language, actionless-action and thinkingless-thought,");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](106, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](107, " And through your holy Spirit, open our questions and hearts to your True presence. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](108, "mat-card-footer");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](109, "mat-divider");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](110, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](111, " Refuge Recovery | AA ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](112, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](113, "img", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        }
      },
      dependencies: [_angular_material_divider__WEBPACK_IMPORTED_MODULE_1__.MatDivider, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardFooter, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardTitle],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJtaW5kZnVsbmVzcy5jb21wb25lbnQuc2NzcyJ9 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9taW5kZnVsbmVzcy9taW5kZnVsbmVzcy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0Esd0tBQXdLIiwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 2978:
/*!********************************************************!*\
  !*** ./src/app/modules/outreach/outreach.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OutreachComponent: () => (/* binding */ OutreachComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 819);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 3900);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _word_blogger_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../word/blogger.service */ 6970);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/divider */ 4102);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/card */ 3777);







function OutreachComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Loading recent posts...");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function OutreachComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r0.errorMessage);
  }
}
function OutreachComponent_ul_26_li_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "li", 6)(1, "a", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](4, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const post_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("href", post_r2.url, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", post_r2.title, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" on ", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](4, 3, post_r2.published, "short"), " ");
  }
}
function OutreachComponent_ul_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ul", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, OutreachComponent_ul_26_li_1_Template, 5, 6, "li", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r0.posts);
  }
}
function OutreachComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " No posts available. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
class OutreachComponent {
  constructor(bloggerService) {
    this.bloggerService = bloggerService;
    this.posts = [];
    this.errorMessage = '';
    this.loading = false;
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
  }
  ngOnInit() {
    this.getRecentPosts();
  }
  getRecentPosts() {
    console.log('Getting recent posts...');
    this.loading = true;
    this.bloggerService.getRecentPosts().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.takeUntil)(this.destroy$)).subscribe(response => {
      console.log('Received response:', response);
      this.extractPosts(response);
      this.loading = false;
    }, error => {
      console.error('Request failed with error:', error);
      this.errorMessage = 'Failed to load recent posts';
      this.loading = false;
    });
  }
  extractPosts(response) {
    console.log('Extracting posts...');
    if (response && response.items) {
      this.posts = response.items.map(item => ({
        kind: item.kind,
        url: item.url,
        published: item.published,
        title: item.title,
        id: item.id
      }));
    }
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  static {
    this.ɵfac = function OutreachComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OutreachComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_word_blogger_service__WEBPACK_IMPORTED_MODULE_0__.BloggerService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: OutreachComponent,
      selectors: [["app-outreach"]],
      decls: 33,
      vars: 4,
      consts: [[4, "ngIf"], ["class", "error-message", 4, "ngIf"], ["class", "list-group", 4, "ngIf"], [1, "error-message"], [1, "list-group"], ["class", "list-group-item", 4, "ngFor", "ngForOf"], [1, "list-group-item"], ["target", "_blank", 3, "href"]],
      template: function OutreachComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div")(1, "h2");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Outreach");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "mat-card")(4, "mat-card-title");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, " Be the Church in the community ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "mat-card-content");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, " Urban Bicycle Food Ministry");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, " Interfaith Alliance");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](10, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, " Open and Affirming Coalition");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](12, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, " Food Pantry of Central Iowa");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "br")(15, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, " Support Ukraine");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](17, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](18, "mat-card-footer");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](19, "mat-divider");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "mat-card")(21, "mat-card-title");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "Recent Articles");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "mat-card-content");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](24, OutreachComponent_div_24_Template, 2, 0, "div", 0)(25, OutreachComponent_div_25_Template, 2, 1, "div", 1)(26, OutreachComponent_ul_26_Template, 2, 1, "ul", 2)(27, OutreachComponent_div_27_Template, 2, 0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](28, "mat-divider");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, " Monthly givings | Planned Bike Rides ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, " because together we are more than just a church. We serve the One that created us so that we can share life that sustains and creates joy in the world ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](24);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.errorMessage);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.posts.length > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.posts.length === 0 && !ctx.errorMessage);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_material_divider__WEBPACK_IMPORTED_MODULE_5__.MatDivider, _angular_material_card__WEBPACK_IMPORTED_MODULE_6__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_6__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_6__.MatCardFooter, _angular_material_card__WEBPACK_IMPORTED_MODULE_6__.MatCardTitle, _angular_common__WEBPACK_IMPORTED_MODULE_4__.DatePipe],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJvdXRyZWFjaC5jb21wb25lbnQuc2NzcyJ9 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9vdXRyZWFjaC9vdXRyZWFjaC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0Esb0tBQW9LIiwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 348:
/*!************************************************************!*\
  !*** ./src/app/modules/statements/statements.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StatementsComponent: () => (/* binding */ StatementsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class StatementsComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function StatementsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || StatementsComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: StatementsComponent,
      selectors: [["app-statements"]],
      decls: 3,
      vars: 0,
      template: function StatementsComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " List of Statements ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "> ");
        }
      },
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzdGF0ZW1lbnRzLmNvbXBvbmVudC5zY3NzIn0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9zdGF0ZW1lbnRzL3N0YXRlbWVudHMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHdLQUF3SyIsInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 7906:
/*!******************************************************!*\
  !*** ./src/app/modules/wedding/wedding.component.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WeddingComponent: () => (/* binding */ WeddingComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/divider */ 4102);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/card */ 3777);



class WeddingComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function WeddingComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || WeddingComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: WeddingComponent,
      selectors: [["app-wedding"]],
      decls: 40,
      vars: 0,
      consts: [["src", "assets/img/flower_bouquet.jpg", 2, "width", "600px", "height", "460px"]],
      template: function WeddingComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div")(1, "h2");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Considering Marriage??");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "mat-card")(4, "mat-card-title");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, " Wedding Services ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "mat-card-content");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, " Pre-marriage counseling");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " Ceremony and reception planning");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "mat-card-footer");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "mat-divider");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "mat-card")(14, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, " \"Simplicity, patience, compassion.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, " These three are your greatest treasures.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, " Simple in actions and thoughts, you return to the source of being.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](20, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, " Patient with both friends and enemies,");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](22, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, " you accord with the way things are.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, " Compassionate toward yourself,");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](26, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, " you reconcile all beings in the world.\"");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](28, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, " (Tao Te Ching)");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](30, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](31, "mat-divider");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, " Love is patient; love is kind; love is not envious or boastful or arrogant or rude. It does not insist on its own way; it is not irritable or resentful; it does not rejoice in wrongdoing, but rejoices in the truth. It bears all things, believes all things, hopes all things, endures all things. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](34, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "1 Corinthians:4-7 (NRSV)");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, " Be united in faith, spirit and fullness of grace. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](39, "img", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        }
      },
      dependencies: [_angular_material_divider__WEBPACK_IMPORTED_MODULE_1__.MatDivider, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardFooter, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardTitle],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ3ZWRkaW5nLmNvbXBvbmVudC5zY3NzIn0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy93ZWRkaW5nL3dlZGRpbmcuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLG9LQUFvSyIsInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 6970:
/*!*************************************************!*\
  !*** ./src/app/modules/word/blogger.service.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BloggerService: () => (/* binding */ BloggerService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);




class BloggerService {
  constructor(httpClient) {
    this.httpClient = httpClient;
    this.headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  }
  getRecentPosts() {
    console.log('Calling Blogger API via Lambda proxy...');
    return this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.bloggerApiUrl, {
      headers: this.headers,
      responseType: 'json'
    });
  }
  static {
    this.ɵfac = function BloggerService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || BloggerService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: BloggerService,
      factory: BloggerService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 3052:
/*!************************************************!*\
  !*** ./src/app/modules/word/word.component.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WordComponent: () => (/* binding */ WordComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 819);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _blogger_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blogger.service */ 6970);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/card */ 3777);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/divider */ 4102);






function WordComponent_li_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "li", 5)(1, "a", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](4, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const post_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("href", post_r1.url, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", post_r1.title, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" on ", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](4, 3, post_r1.published, "MMMM dd, yyyy"), " ");
  }
}
class WordComponent {
  constructor(bloggerService) {
    this.bloggerService = bloggerService;
    this.posts = [];
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
  }
  ngOnInit() {
    this.getRecent();
  }
  getRecent() {
    console.log('getting recent...');
    this.bloggerService.getRecentPosts()
    //.pipe(take())
    .subscribe(response => {
      () => this.bloggerResponse = response;
      console.log('subscribed to resp...');
      this.extractPosts(response);
    }, error => {
      console.error('Request failed with error' + error);
      this.errorMessage = error;
      this.loading = false;
    });
  }
  extractPosts(response) {
    console.log('extract posts...');
    if (response && response.items) {
      response.items.forEach(item => {
        var aPost = {
          kind: item.kind,
          url: item.url,
          published: item.published,
          title: item.title,
          id: item.id
        };
        this.posts.push(aPost);
      });
    }
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  static {
    this.ɵfac = function WordComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || WordComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_blogger_service__WEBPACK_IMPORTED_MODULE_0__.BloggerService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: WordComponent,
      selectors: [["app-word"]],
      decls: 28,
      vars: 1,
      consts: [["href", "https://www.youtube.com/channel/UCm2fDVv75DXywKgr7ZSB_0g"], [1, "list-group"], ["class", "list-group-item", 4, "ngFor", "ngForOf"], ["href", "https://tonyswebstudios.blogspot.com/"], ["href", "https://lectionary.library.vanderbilt.edu/", "target", "_blank"], [1, "list-group-item"], ["target", "_blank", 3, "href"]],
      template: function WordComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div")(1, "mat-card")(2, "h2");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Word and Sacrament");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "mat-card")(5, "mat-card-title");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Worship online via ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "a", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "YouTube");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](9, "mat-card-content")(10, "mat-card-footer");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](11, "mat-divider");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, " For where two or more gather in my name, I am there among them. Matthew 18:20 (NRSV)");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, " And he took bread, gave thanks, broke it and gave it to them saying, \"This is my body given for you; do this in remembrance of me.\" Luke 22:19 (NRSV) ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, " Recent sermons and reflections: ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "mat-card")(19, "ul", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](20, WordComponent_li_20_Template, 5, 6, "li", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "a", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "More can be found here");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](23, "mat-divider");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "mat-card");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](25, " Faith Community Church follows the ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "a", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](27, "Revised Common Lectionary");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](20);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.posts);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_material_card__WEBPACK_IMPORTED_MODULE_4__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_4__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_4__.MatCardFooter, _angular_material_card__WEBPACK_IMPORTED_MODULE_4__.MatCardTitle, _angular_material_divider__WEBPACK_IMPORTED_MODULE_5__.MatDivider, _angular_common__WEBPACK_IMPORTED_MODULE_3__.DatePipe],
      styles: ["ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  list-style: none;\n  padding-bottom: 5px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndvcmQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxnQkFBQTtFQUNBLG1CQUFBO0FBQ0YiLCJmaWxlIjoid29yZC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbInVsIGxpIHtcbiAgbGlzdC1zdHlsZTogbm9uZTtcbiAgcGFkZGluZy1ib3R0b206IDVweDtcbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy93b3JkL3dvcmQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxnQkFBQTtFQUNBLG1CQUFBO0FBQ0Y7QUFDQSxnVkFBZ1YiLCJzb3VyY2VzQ29udGVudCI6WyJ1bCBsaSB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG4gIHBhZGRpbmctYm90dG9tOiA1cHg7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 6043:
/*!*********************************************!*\
  !*** ./src/app/modules/word/word.module.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WordModule: () => (/* binding */ WordModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _word_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./word.component */ 3052);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/divider */ 4102);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/card */ 3777);
/* harmony import */ var _blogger_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./blogger.service */ 6970);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);







class WordModule {
  static {
    this.ɵfac = function WordModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || WordModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: WordModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
      providers: [_blogger_service__WEBPACK_IMPORTED_MODULE_1__.BloggerService, (0,_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.provideHttpClient)((0,_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.withInterceptorsFromDi)())],
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_5__.MatCardModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_6__.MatDividerModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](WordModule, {
    declarations: [_word_component__WEBPACK_IMPORTED_MODULE_0__.WordComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_5__.MatCardModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_6__.MatDividerModule],
    exports: [_word_component__WEBPACK_IMPORTED_MODULE_0__.WordComponent]
  });
})();

/***/ }),

/***/ 1765:
/*!**************************************************************!*\
  !*** ./src/app/shared/components/footer/footer.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FooterComponent: () => (/* binding */ FooterComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/flex-layout/flex */ 1447);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/card */ 3777);



class FooterComponent {
  constructor() {
    this.version = '1.0.0';
    this.buildDate = new Date().toISOString().split('T')[0];
  }
  ngOnInit() {}
  static {
    this.ɵfac = function FooterComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || FooterComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: FooterComponent,
      selectors: [["app-footer"]],
      decls: 30,
      vars: 2,
      consts: [["fxFlex", "", "flexLayout", "row", "fxLayoutAlign", "space-around center"], [2, "list-style", "none"], ["href", "#"], ["href", "http://www.tigersndragons.com/orgstartup.html"], ["href", "http://www.tigersndragons.com"], ["id", "contact"], [1, "version-info"]],
      template: function FooterComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "mat-card")(2, "ul")(3, "li", 1)(4, "a", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "About Faith Community");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "li", 1)(7, "a", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Nonprofit Resources");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "li", 1)(10, "a", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Tech Services");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "mat-card", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, " Faith Community Church");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](14, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, " c/o Hope and Truth Ministry");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, " Des Moines, IA");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "mat-card")(20, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "\u00A9 Copyright 2016-2026");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](22, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, " Hope and Truth Ministry ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, " All Rights Reserved.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "a", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "A BigKittyMeows Production");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](29);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"](" Version ", ctx.version, " | Build Date: ", ctx.buildDate, " ");
        }
      },
      dependencies: [_angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_1__.DefaultLayoutAlignDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_1__.DefaultFlexDirective, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCard],
      styles: ["footer[_ngcontent-%COMP%] {\n  padding: 10px;\n}\n\nmat-card[_ngcontent-%COMP%] {\n  margin: 8px;\n  padding: 16px;\n}\n\n#contact[_ngcontent-%COMP%] {\n  text-align: center;\n}\n\n.version-info[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  font-size: 0.75rem;\n  color: #666;\n  font-style: italic;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvb3Rlci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGFBQUE7QUFDRjs7QUFFQTtFQUNFLFdBQUE7RUFDQSxhQUFBO0FBQ0Y7O0FBRUE7RUFDRSxrQkFBQTtBQUNGOztBQUVBO0VBQ0UsZUFBQTtFQUNBLGtCQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0FBQ0YiLCJmaWxlIjoiZm9vdGVyLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiZm9vdGVyIHtcbiAgcGFkZGluZzogMTBweDtcbn1cblxubWF0LWNhcmQge1xuICBtYXJnaW46IDhweDtcbiAgcGFkZGluZzogMTZweDtcbn1cblxuI2NvbnRhY3Qge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi52ZXJzaW9uLWluZm8ge1xuICBtYXJnaW4tdG9wOiA4cHg7XG4gIGZvbnQtc2l6ZTogMC43NXJlbTtcbiAgY29sb3I6ICM2NjY7XG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGFBQUE7QUFDRjs7QUFFQTtFQUNFLFdBQUE7RUFDQSxhQUFBO0FBQ0Y7O0FBRUE7RUFDRSxrQkFBQTtBQUNGOztBQUVBO0VBQ0UsZUFBQTtFQUNBLGtCQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0FBQ0Y7QUFDQSxvckJBQW9yQiIsInNvdXJjZXNDb250ZW50IjpbImZvb3RlciB7XG4gIHBhZGRpbmc6IDEwcHg7XG59XG5cbm1hdC1jYXJkIHtcbiAgbWFyZ2luOiA4cHg7XG4gIHBhZGRpbmc6IDE2cHg7XG59XG5cbiNjb250YWN0IHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4udmVyc2lvbi1pbmZvIHtcbiAgbWFyZ2luLXRvcDogOHB4O1xuICBmb250LXNpemU6IDAuNzVyZW07XG4gIGNvbG9yOiAjNjY2O1xuICBmb250LXN0eWxlOiBpdGFsaWM7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 9381:
/*!**************************************************************!*\
  !*** ./src/app/shared/components/header/header.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HeaderComponent: () => (/* binding */ HeaderComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/toolbar */ 9552);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/icon */ 3840);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 4175);
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/flex-layout/flex */ 1447);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 5072);







const _c0 = () => ["/about"];
class HeaderComponent {
  constructor() {
    this.toggleSidebarEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
  }
  ngOnInit() {}
  toggleSidebar() {
    this.toggleSidebarEmitter.emit();
  }
  static {
    this.ɵfac = function HeaderComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || HeaderComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: HeaderComponent,
      selectors: [["app-header"]],
      outputs: {
        toggleSidebarEmitter: "toggleSidebarEmitter"
      },
      decls: 16,
      vars: 2,
      consts: [[1, "purple-background"], ["mat-icon-button", "", 3, "click"], ["fxFlex", "", "flexLayout", "row", "fxLayoutAlign", "flex-end"], ["fxLayout", "row", "fxLayoutGap", "20px"], ["mat-button", "", 3, "routerLink"], [1, "yellow-divide"]],
      template: function HeaderComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-toolbar")(1, "mat-toolbar-row", 0)(2, "button", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HeaderComponent_Template_button_click_2_listener() {
            return ctx.toggleSidebar();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "mat-icon");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "menu");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, " Faith Community Church ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 2)(8, "ul", 3)(9, "li")(10, "button", 4)(11, "mat-icon");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "help_outline");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, " About ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "mat-toolbar-row", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
        }
      },
      dependencies: [_angular_material_toolbar__WEBPACK_IMPORTED_MODULE_1__.MatToolbar, _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_1__.MatToolbarRow, _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__.MatIcon, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatIconButton, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_4__.DefaultLayoutDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_4__.DefaultLayoutGapDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_4__.DefaultLayoutAlignDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_4__.DefaultFlexDirective, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink],
      styles: ["ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  list-style: none;\n}\n\n.purple-background[_ngcontent-%COMP%] {\n  background-color: rgb(129, 29, 195);\n  color: white;\n}\n\n.yellow-divide[_ngcontent-%COMP%] {\n  background-color: yellow;\n  max-height: 10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlYWRlci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGdCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxtQ0FBQTtFQUNBLFlBQUE7QUFDRjs7QUFDQTtFQUNFLHdCQUFBO0VBQ0EsZ0JBQUE7QUFFRiIsImZpbGUiOiJoZWFkZXIuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJ1bCBsaSB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG59XG5cbi5wdXJwbGUtYmFja2dyb3VuZCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigxMjksIDI5LCAxOTUpO1xuICBjb2xvcjp3aGl0ZTtcbn1cbi55ZWxsb3ctZGl2aWRlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogeWVsbG93O1xuICBtYXgtaGVpZ2h0OiAxMHB4O1xufVxuIl19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvaGVhZGVyL2hlYWRlci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGdCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxtQ0FBQTtFQUNBLFlBQUE7QUFDRjs7QUFDQTtFQUNFLHdCQUFBO0VBQ0EsZ0JBQUE7QUFFRjtBQUNBLHdrQkFBd2tCIiwic291cmNlc0NvbnRlbnQiOlsidWwgbGkge1xuICBsaXN0LXN0eWxlOiBub25lO1xufVxuXG4ucHVycGxlLWJhY2tncm91bmQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTI5LCAyOSwgMTk1KTtcbiAgY29sb3I6d2hpdGU7XG59XG4ueWVsbG93LWRpdmlkZSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHllbGxvdztcbiAgbWF4LWhlaWdodDogMTBweDtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 1417:
/*!****************************************************************!*\
  !*** ./src/app/shared/components/sidebar/sidebar.component.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SidebarComponent: () => (/* binding */ SidebarComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/divider */ 4102);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/icon */ 3840);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/list */ 943);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 5072);





class SidebarComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function SidebarComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SidebarComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: SidebarComponent,
      selectors: [["app-sidebar"]],
      decls: 25,
      vars: 0,
      consts: [["mat-list-item", "", "href", "/"], ["mat-list-item", "", "href", "https://tonyswebstudios.blogspot.com/", "target", "_blank"], ["matSubheader", ""], ["mat-list-item", "", "routerLinkActive", "list-item-active", "routerLink", "/word"], ["mat-list-item", "", "href", "/fitness"], ["mat-list-item", "", "routerLinkActive", "list-item-active", "routerLink", "/mindfulness"], ["mat-list-item", "", "routerLinkActive", "list-item-active", "routerLink", "/wedding"], ["mat-list-item", "", "routerLinkActive", "list-item-active", "routerLink", "/outreach"], ["mat-list-item", "", "routerLinkActive", "list-item-active", "routerLink", "/devotionals"]],
      template: function SidebarComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-nav-list");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "mat-divider");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Home");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "mat-divider");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "a", 1)(6, "mat-icon");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "search_outline");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, " Search Blog ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "mat-divider");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Ministries");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "a", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Word & Sacrament");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "a", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Fitness");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "a", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Mindfulness");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "a", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Weddings");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "a", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Outreach");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "a", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Devotionals");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "mat-divider");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
      },
      dependencies: [_angular_material_divider__WEBPACK_IMPORTED_MODULE_1__.MatDivider, _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__.MatIcon, _angular_material_list__WEBPACK_IMPORTED_MODULE_3__.MatNavList, _angular_material_list__WEBPACK_IMPORTED_MODULE_3__.MatListItem, _angular_material_list__WEBPACK_IMPORTED_MODULE_3__.MatListSubheaderCssMatStyler, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLinkActive],
      styles: ["[_nghost-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  vertical-align: middle;\n  margin-right: 5px;\n}\n[_nghost-%COMP%]   .mat-list-item[_ngcontent-%COMP%] {\n  color: #eee;\n  text-align: left;\n}\n[_nghost-%COMP%]   .mat-subheader[_ngcontent-%COMP%] {\n  color: yellow;\n}\n\nmat-nav-list[_ngcontent-%COMP%] {\n  padding: 5px;\n  color: rgb(235, 234, 234);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpZGViYXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0U7RUFDRSxzQkFBQTtFQUNBLGlCQUFBO0FBQUo7QUFFRTtFQUNFLFdBQUE7RUFDQSxnQkFBQTtBQUFKO0FBRUU7RUFDRSxhQUFBO0FBQUo7O0FBSUE7RUFDRSxZQUFBO0VBQ0EseUJBQUE7QUFERiIsImZpbGUiOiJzaWRlYmFyLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICAubWF0LWljb24ge1xuICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgbWFyZ2luLXJpZ2h0OiA1cHg7XG4gIH1cbiAgLm1hdC1saXN0LWl0ZW0ge1xuICAgIGNvbG9yOiAjZWVlO1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gIH1cbiAgLm1hdC1zdWJoZWFkZXIge1xuICAgIGNvbG9yOiB5ZWxsb3c7XG4gIH1cbn1cblxubWF0LW5hdi1saXN0IHtcbiAgcGFkZGluZzogNXB4O1xuICBjb2xvcjogcmdiKDIzNSwgMjM0LCAyMzQpO1xufVxuXG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvc2lkZWJhci9zaWRlYmFyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNFO0VBQ0Usc0JBQUE7RUFDQSxpQkFBQTtBQUFKO0FBRUU7RUFDRSxXQUFBO0VBQ0EsZ0JBQUE7QUFBSjtBQUVFO0VBQ0UsYUFBQTtBQUFKOztBQUlBO0VBQ0UsWUFBQTtFQUNBLHlCQUFBO0FBREY7QUFDQSw0dEJBQTR0QiIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcbiAgLm1hdC1pY29uIHtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgIG1hcmdpbi1yaWdodDogNXB4O1xuICB9XG4gIC5tYXQtbGlzdC1pdGVtIHtcbiAgICBjb2xvcjogI2VlZTtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICB9XG4gIC5tYXQtc3ViaGVhZGVyIHtcbiAgICBjb2xvcjogeWVsbG93O1xuICB9XG59XG5cbm1hdC1uYXYtbGlzdCB7XG4gIHBhZGRpbmc6IDVweDtcbiAgY29sb3I6IHJnYigyMzUsIDIzNCwgMjM0KTtcbn1cblxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 3887:
/*!*****************************************!*\
  !*** ./src/app/shared/shared.module.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SharedModule: () => (/* binding */ SharedModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _components_header_header_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/header/header.component */ 9381);
/* harmony import */ var _components_sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/sidebar/sidebar.component */ 1417);
/* harmony import */ var _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/footer/footer.component */ 1765);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/divider */ 4102);
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/toolbar */ 9552);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/icon */ 3840);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/button */ 4175);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/menu */ 1034);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/list */ 943);
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/flex-layout */ 9981);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/card */ 3777);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);














class SharedModule {
  static {
    this.ɵfac = function SharedModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SharedModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
      type: SharedModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_5__.MatDividerModule, _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_6__.MatToolbarModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIconModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButtonModule, _angular_flex_layout__WEBPACK_IMPORTED_MODULE_9__.FlexLayoutModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_10__.MatMenuModule, _angular_material_list__WEBPACK_IMPORTED_MODULE_11__.MatListModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_12__.MatCardModule, _angular_router__WEBPACK_IMPORTED_MODULE_13__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](SharedModule, {
    declarations: [_components_header_header_component__WEBPACK_IMPORTED_MODULE_0__.HeaderComponent, _components_sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_1__.SidebarComponent, _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_2__.FooterComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_5__.MatDividerModule, _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_6__.MatToolbarModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIconModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButtonModule, _angular_flex_layout__WEBPACK_IMPORTED_MODULE_9__.FlexLayoutModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_10__.MatMenuModule, _angular_material_list__WEBPACK_IMPORTED_MODULE_11__.MatListModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_12__.MatCardModule, _angular_router__WEBPACK_IMPORTED_MODULE_13__.RouterModule],
    exports: [_components_header_header_component__WEBPACK_IMPORTED_MODULE_0__.HeaderComponent, _components_sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_1__.SidebarComponent, _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_2__.FooterComponent]
  });
})();

/***/ }),

/***/ 5312:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   environment: () => (/* binding */ environment)
/* harmony export */ });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
  production: false,
  bloggerApiUrl: 'https://7scvpkelqj.execute-api.us-west-2.amazonaws.com/prod/blogger/posts' //'http://localhost:3000/blogger/posts' // For local development
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

/***/ }),

/***/ 4429:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ 436);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 635);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ 5312);




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.production) {
  (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.enableProdMode)();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.error(err));

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4429)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map