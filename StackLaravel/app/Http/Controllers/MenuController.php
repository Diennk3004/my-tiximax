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
    public function create(Request $request){
        $data=array();
        $checked=true;
        $message="";
        if($request->isMethod("post")){
            $menu=new Menu;
            $menu->name=$request->name;      
            $menu->url=$request->url;     
            $menu->save();
            $data["menu"]=$menu;
        }
        return response()->json(["data"=>$data,"message"=>$message,"checked"=>$checked],200);
    }
    public function update(string $id,Request $request){
        $data=array();
        $checked=true;
        $message="";
        if($request->isMethod("post")){            
            $menu=Menu::find($id);
            if(!$menu){
                $checked=false;
                $message="Menu not found";
            }else{
                if($request->name){
                    $menu->name=$request->name;                
                }
                if($request->url){
                    $menu->url=$request->url;
                }
                $menu->save();
                $data["menu"]=$menu;
            }
        }
        return response()->json(["data"=>$data,"message"=>$message,"checked"=>$checked],200);
    }
}
