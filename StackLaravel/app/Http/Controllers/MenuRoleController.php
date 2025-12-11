<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MenuRole;
class MenuRoleController extends Controller
{
    public function assignMenuToRole(string $task,?string $id = '0',Request $request){
        $data=array();
        $checked=true;
        $message="";
        if($request->isMethod("post")){
            $menuRole=null;
            if($task==="add"){
                $menuRole=new MenuRole;
            }else{
                $menuRole=MenuRole::find($id);
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
        return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
}
