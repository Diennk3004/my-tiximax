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
        Route::post("/check-valid-token",[UserController::class,"checkValidToken"]);
        Route::prefix('user')->group(function () {
            Route::get("/list",[UserController::class,"getList"]);  
            Route::get("/detail/{id?}",[UserController::class,"getDetail"]);      
            Route::post("/save/{id?}",[UserController::class,"save"]);
            Route::put("/delete/{id?}",[UserController::class,"delete"]);      
        });
        Route::prefix("role")->group(function(){
            Route::get("/list",[RoleController::class,"getList"]);
            Route::get("/detail/{id?}",[RoleController::class,"getDetail"]);
            Route::post("/save/{id?}",[RoleController::class,"save"]);
            Route::put("/delete/{id?}",[RoleController::class,"delete"]);      
        });        
        Route::prefix("menu")->group(function(){
            Route::get("/list",[MenuController::class,"getList"]);
            Route::get("/detail/{id?}",[MenuController::class,"getDetail"]);
            Route::post("/save/{id?}",[MenuController::class,"save"]);
            Route::put("/delete/{id?}",[MenuController::class,"delete"]);             
        });
        Route::prefix("menu-role")->group(function(){
            Route::post("/assign/{id?}",[MenuRoleController::class,"assignMenuToRole"]);
        });        
    });
});


