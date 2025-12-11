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
            $message="";
            $checked=true;
            $data=array();      
            if($request->isMethod("post")){
                $username=$request->username;
                $password=$request->password;                                         
                $userByUsername=User::where("username",$username)->first();                  
                if(!$userByUsername){
                    $checked=false;
                    $message="Username not found";
                }else{
                    $credentials = [
                        "email" => $userByUsername->email,
                        "password" => $password,
                    ];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                    $auth = Auth::attempt($credentials);            
                    if($auth===false){
                        $checked=false;
                        $message="Password is incorrect";
                    }else{
                        $user=Auth::user();
                        $token=$request->user()->createToken("API_Token")->plainTextToken;
                        $data["token"]=$token;
                        $user->remember_token=$token;
                        $user->save();
                        $role=Role::find($user->role_id);
                        $user->role_name=$role ? $role->name : "";
                        $query=DB::table("menu")->join("menu_role","menu.id","=","menu_role.menu_id")->join("roles","menu_role.role_id","=","roles.id");
                        $query->where("roles.id",$user->role_id);
                        $menuList=$query->select("menu.id","menu.name","menu.url")->get(); 
                        $user["menu"]=$menuList;                   
                        $data["user"]=$user;                    
                    }                
                }            
            }
            return response()->json(["data"=>$data,"message"=>$message,"checked"=>$checked],200);
       
    }
    public function logout(Request $request){
        $checked=true;
        $message="";
        $data=array();       
        if($request->isMethod("post")){                
            $user=$request->user();
            $user->remember_token=null;
            $user->save();
            $request->user()->currentAccessToken()->delete();     
        }
        return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
    public function create(Request $request){  
        try{
            $checked=true;
            $message="";
            $data=array();           
            if($request->isMethod("post")){                            
                $user=new User;
                $user->username=$request->username;
                $user->password=Hash::make($request->password);
                $user->name=$request->name;
                $user->email=$request->email;
                $user->phone=$request->phone;
                $user->save();
                $data['user']=$user;
            } 
            return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
        }catch(Exception $e){
            return response()->json(["message"=>$e],500);
        }        
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
            }else{
                $query=DB::table("users")->join("roles","users.role_id","=","roles.id");
                $query->where("users.id",$user->id);
                $user=$query->select("users.id","users.username","users.name","users.role_id","roles.name as role_name")->first();                                
                $query=DB::table("menu")->join("menu_role","menu.id","=","menu_role.menu_id")->join("roles","menu_role.role_id","=","roles.id");
                $query->where("roles.id",$user->role_id);
                $menuList=$query->select("menu.id","menu.name","menu.url")->get(); 
                $user->menu=$menuList;
                $data["user"]=$user;                
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
