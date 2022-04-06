<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Instructor;

class InstructorController extends Controller
{
    public function index(){
        return Instructor::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'username'=>'required',
            'name'=>'required',
            'lastname'=>'required'
        ]);

        try{
            Instructor::create($request->post());

            return response()->json([
                'message'=>'Instructor Created Successfully!!'
            ]);
        }catch(\Exception $e){
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while creating a Instructor!!'
            ],500);
        }
    }

    public function show(Instructor $instructor)
    {
        return response()->json([
            'instructor'=>$instructor
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id'=>'required',
            'username'=>'required',
            'name'=>'required',
            'lastname'=>'required'
        ]);

        try{
            Instructor::find($request->post()["id"])->update($request->post());
            return response()->json([
                'message'=>'Instructor Updated Successfully!!'
            ]);

        }catch(\Exception $e){
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while updating a instructor!!'
            ],500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            Instructor::where('id', $request->post()["id"])->delete();
            return response()->json([
                'message'=>'Instructor Deleted Successfully!!'
            ]);
            
        } catch (\Exception $e) {
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while deleting a instructor!!'
            ]);
        }
    }
}
