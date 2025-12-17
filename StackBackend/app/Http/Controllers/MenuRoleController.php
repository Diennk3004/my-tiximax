<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MenuRole;
class MenuRoleController extends Controller
{
    public function assignMenuToRole(Request $request,string $id = null){
        $data=array();
        $checked=true;
        $message="";
        if($request->isMethod("post")){
            if(!$request->menu_id){
                $checked=false;
                $message="MenuId is required";
            }
            if(!$request->role_id){
                $checked=false;
                $message="RoleId is required";
            }
            if($checked===true){
                $menuRole=null;
                if($id){
                    $menuRole=MenuRole::find($id);                
                }else{
                    $menuRole=new MenuRole;
                }     
                if($request->menu_id){
                    $menuRole->menu_id=$request->menu_id;
                }
                if($request->role_id){
                    $menuRole->role_id=$request->role_id;
                }
                $menuRole->save();
                $data["menu_role"]=$menuRole;       
                $message="Assign menu to role successfully";   
            }                              
        }
        return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
}
