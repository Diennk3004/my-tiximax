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
    public function getDetail(string $id=null){
            $checked=true;
            $message="";
            $data=array();   
            if(!$id){
                $checked=false;
                $message="Item not founded";
            }    
            if($checked===true){
                $role=Role::find($id);
                $data["role"]=$role;     
            }            
            return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
    public function save(Request $request,string $id=null){        
        $checked=true;
        $message="";
        $data=array();
        if($request->isMethod("post")){
            $role=null;
            if($id){                            
                $role=Role::find($id);
                if(!$role){
                    $checked=false;
                    $message="Item not founded";
                }                
            }else{                
                $role=new Role;
                if(!$request->name){
                    $checked=false;
                    $message="Name is empty";
                }                
            }                        
            if($checked==true){
                if($request->name){
                    $role->name=$request->name;
                }                
                $role->save();
                $data["role"]=$role;
                if($id){
                    $message="Update item successfully";
                }     else{
                    $message="Create item successfully";        
                }                                   
            }                                  
        }
        return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }    
    public function delete(string $id,Request $request){      
        $data=array();
        $message="";
        $checked=true;
        if($request->isMethod("put")){
            if(!$id){
                $checked=false;    
                $message="Empty deleted id";            
            }             
            if($checked===true){
                $role=Role::find($id);                      
                if(!$role){
                    $checked=false;
                    $message="Item not found";
                }else{                                     
                    $role::destroy($id);                    
                }     
            }
        }
        return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
}
