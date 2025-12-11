<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MenuRoleController;
Route::prefix('auth')->group(function () {
    Route::post('/login', [UserController::class,"login"]);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout',[UserController::class,"logout"]);
        Route::post("/user/create",[UserController::class,"create"]);
        Route::get("/role/list",[RoleController::class,"getList"]);
        Route::post("/role/create",[RoleController::class,"create"]);
        Route::get("/user/list",[UserController::class,"getList"]);
        Route::post("/role/update/{id}",[RoleController::class,"update"]);
        Route::post("/check-valid-token",[UserController::class,"checkValidToken"]);
        Route::get("/menu/list",[MenuController::class,"getList"]);
        Route::post("/menu/create",[MenuController::class,"create"]);
        Route::post("/menu/update/{id}",[MenuController::class,"update"]);
        Route::post("/menu-role/assign-menu-to-role/{task}/{id?}",[MenuRoleController::class,"assignMenuToRole"]);
    });
});


