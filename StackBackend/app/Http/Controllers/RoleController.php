<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Role;
class RoleController extends Controller
{
    public function getList(){
         $checked=true;
            $message="";
            $data=array();  
            $query=    DB::table("roles"); 
            $query->select("roles.id","roles.name");
            $roles= $query->orderBy("roles.name","asc")->get();    
            $total = DB::table('roles')->count();        
            $data["roles"]=$roles;     
            $data["total"]=$total;
            return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
    public function getDetail(string $id){
            $checked=true;
            $message="";
            $data=array();               
            if(!$id){
                $checked=false;
                $message="Item not found";
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
                    $message="Item not found";
                }                
            }else{                
                $role=new Role;
                if(!$request->name){
                    $checked=false;
                    $message="Name is required";
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
    public function delete(Request $request,string $id=null){      
        $data=array();
        $message="";
        $checked=true;
        if($request->isMethod("put")){
            if(!$id){
                $checked=false;    
                $message="Id is required";            
            }             
            if($checked===true){
                $role=Role::find($id);                      
                if(!$role){
                    $checked=false;
                    $message="Item not found";
                }else{                                     
                    $role::destroy($id);  
                    $message="Delete successfully";                  
                }     
            }
        }
        return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
}
