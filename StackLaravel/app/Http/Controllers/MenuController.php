<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;
class MenuController extends Controller
{
    public function getList(Request $request){
        
            $checked=true;
            $message="";
            $data=array();       
            $menus=Menu::all();
            $data["menus"]=$menus;     
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
                $menu=Menu::find($id);
                $data["menu"]=$menu;     
            }            
            return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }
    public function save(Request $request,string $id){        
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
                if($id){
                    $message="Update item successfully";
                }     else{
                    $message="Create item successfully";        
                }                  
            }                                  
        }
        return response()->json(["data"=>$data,"checked"=>$checked,"message"=>$message],200);
    }    
}
