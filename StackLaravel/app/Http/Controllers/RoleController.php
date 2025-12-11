<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
class RoleController extends Controller
{
    public function getList(){
         $checked=true;
            $message="";
            $data=array();       
            $roles=Role::all();
            $data["roles"]=$roles;     
            return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
    public function create(Request $request){        
        $checked=true;
        $message="";
        $data=array();
        if($request->isMethod("post")){
            $role=new Role;
            $role->name=$request->name;
            $role->save();
            $data["role"]=$role;
        }
        return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
    public function update(string $id,Request $request){
        $checked=true;
        $message="";
        $data=array();
        if($request->isMethod("post")){
            $role=Role::find($id);
            if(!role){
                $checked=false;
                $message="Role not found";
            }else{
                $role->name=$request->name;
                $role->save();
            }        
        }
        return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
}
