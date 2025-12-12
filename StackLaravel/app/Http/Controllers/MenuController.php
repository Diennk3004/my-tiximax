<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;
use Illuminate\Support\Facades\DB;
class MenuController extends Controller
{
    public function getList(Request $request){
        
            $checked=true;
            $message="";
            $data=array();       
            $query=DB::table("menu");
            $menus=$query->get();
            $data["menus"]=$menus;     
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
                $menu=Menu::find($id);
                $data["menu"]=$menu;     
            }            
            return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
    public function save(Request $request,string $id=null){        
        $checked=true;
        $message="";
        $data=array();
        if($request->isMethod("post")){
            $menu=null;
            if($id){                
                $menu=Menu::find($id);
                if(!$menu){
                    $checked=false;
                    $message="Item not found";
                }
            }else{
                $menu=new Menu;
                if(!$request->name){
                    $checked=false;
                    $message="Name is required";
                }
                if(!$request->url){
                    $checked=false;
                    $message="Url is required";
                }
            }                        
            if($checked==true){
                if($request->name){
                    $menu->name=$request->name;
                }
                if($request->url){
                    $menu->url=$request->url;
                }                                
                $menu->save();
                $data["menu"]=$menu; 
                if($request->role_ids && is_array($request->role_ids)){
                    $roleIdList=$request->role_ids;
                    if($id){
                        $delete=DB::table("menu_role")->where("menu_id","=",$id)->delete();
                        foreach($roleIdList as $key => $val ){
                           $menuRole=new MenuRole;
                           $menuRole->menu_id=$menu->id;
                           $menuRole->role_id=$val;
                        }
                    }else{
                        foreach($roleIdList as $key => $val ){
                           $menuRole=new MenuRole;
                           $menuRole->menu_id=$menu->id;
                           $menuRole->role_id=$val;
                        }
                    }                    
                }else{
                    if($id){
                        $delete=DB::table("menu_role")->where("menu_id","=",$id)->delete();
                    }
                }
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
                $menu=Menu::find($id);                      
                if(!$menu){
                    $checked=false;
                    $message="Item not found";
                }else{                                     
                    $menu::destroy($id);  
                    $message="Delete successfully";                  
                }     
            }
        }
        return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    } 
}
