<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Hash;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
class UserController extends Controller
{
    public function login(Request $request){        
            $user=array();            
            $checked=true;
            $message="";
            $data=array();      
            if($request->isMethod("post")){
                $username=$request->username;
                $password=$request->password;                                         
                $userByUsername=User::where("username",$username)->first();                  
                if(!$userByUsername){
                    $checked=false;
                    $message="Item not found";
                }else{
                    $credentials = [
                        "email" => $userByUsername->email,
                        "password" => $password,
                    ];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                    $auth = Auth::attempt($credentials);            
                    if($auth===false){
                        $checked=false;
                        $message="Password is incorrect";
                    }
                    if($checked===true){
                        $user=Auth::user();
                        $token=$request->user()->createToken("API_Token")->plainTextToken;
                        $data["token"]=$token;
                        $user->remember_token=$token;
                        $user->save();
                        $user=Role::find($user->role_id);
                        $user->role_name=$user ? $user->name : "";
                        $query=DB::table("menu")->join("menu_role","menu.id","=","menu_role.menu_id")->join("roles","menu_role.role_id","=","roles.id");
                        $query->where("roles.id",$user->role_id);
                        $menuList=$query->select("menu.id","menu.name","menu.url")->get(); 
                        $user["menu"]=$menuList;                   
                        $data["user"]=$user;   
                        $message="Login successfully";      
                    }                                                                   
                }            
            }
            return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);       
    }
    public function getDetail(string $id=null){
            $checked=true;
            $message="";
            $data=array();   
            if(!$id){
                $checked=false;
                $message="Item not found";
            }    
            if($checked===true){
                $user=User::find($id);
                $data["user"]=$user;     
            }            
            return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
    public function logout(Request $request){
        $checked=true;        
        $data=array();    
        $message=""; 
        if($request->isMethod("post")){                
            $user=$request->user();
            $user->remember_token=null;
            $user->save();
            $request->user()->currentAccessToken()->delete();   
            $message="Logout successfully";     
        }
        return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
    public function save(Request $request,string $id=null){        
        $checked=true;
        $message="";
        $data=array();
        if($request->isMethod("post")){
            $user=null;
            if($id){                
                $user=User::find($id);
                if(!$user){
                    $checked=false;
                    $message="Item not found";
                }
            }else{
                $user=new User;
                if(!$request->name){
                    $checked=false;
                    $message="Name is required";
                }
                if(!$request->username){
                    $checked=false;
                    $message="Username is required";
                }
                if(!$request->password || !$request->password_confirmed){
                    if(!$request->password){
                        $checked=false;
                        $message="Password is required";
                    }
                    if(!$request->password_confirmed){
                        $checked=false;
                        $message="Password confirmed is required";
                    }
                }else{

                }
                
                if(!$request->email){
                    $checked=false;
                    $message="Email is required";
                }
                if(!$request->phone){
                    $checked=false;
                    $message="Phone is required";
                }
            }                        
            if($checked==true){
                if($request->name){
                    $user->name=$request->name;
                }  
                if($request->username){
                    $user->username=$request->username;
                }  
                if($request->email){
                    $user->email=$request->email;
                }  
                if($request->phone){
                    $user->phone=$request->phone;
                }                                 
                $user->save();
                $data["user"]=$user; 
                if($id){
                    $message="Update item successfully";
                }     else{
                    $message="Create item successfully";        
                }                  
            }                                  
        }
        return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }    
    public function checkValidToken(Request $request){
        $checked=true;
        $message="";
        $data=array();       
        if($request->isMethod("post")){
            $token=$request->token;
            $user=User::where("remember_token",$token)->first();
            if(!$user){
                $checked=false;
                $message="Token is invalid";
            }
            if($checked===true){
                $query=DB::table("users")->join("roles","users.role_id","=","roles.id");
                $query->where("users.id",$user->id);
                $user=$query->select("users.id","users.username","users.name","users.role_id","roles.name as role_name")->first();                                
                $query=DB::table("menu")->join("menu_role","menu.id","=","menu_role.menu_id")->join("roles","menu_role.role_id","=","roles.id");
                $query->where("roles.id",$user->role_id);
                $menuList=$query->select("menu.id","menu.name","menu.url")->get(); 
                $user->menu=$menuList;
                $data["user"]=$user;    
                $message="Authenticate successfully"; 
            }                            
        }
        return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
    public function getList(Request $request){
            $checked=true;
            $message="";
            $data=array();       
            $users=User::all();
            $data["users"]=$users;                    
            return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
}
