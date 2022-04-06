<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Assignment;

class AssignmentController extends Controller
{
    public function index(Request $request){
        $courseID = $request->course;
        if( $courseID){
            return Assignment::where('courseID', $courseID)->get();
        }
        return Assignment::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'courseID'=>'required',
            'assignmentName'=>'required'
        ]);

        try{
            Assignment::create($request->post());

            return response()->json([
                'message'=>'Assignment Created Successfully!!'
            ]);
        }catch(\Exception $e){
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while creating a Assignment!!'
            ],500);
        }
    }

    public function show(Assignment $assignment)
    {
        return response()->json([
            'assignment'=>$assignment
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id'=>'required',
            'courseID'=>'required',
            'assignmentName'=>'required'
        ]);

        try{
            Assignment::find($request->post()["id"])->update($request->post());
            return response()->json([
                'message'=>'Assignment Updated Successfully!!'
            ]);

        }catch(\Exception $e){
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while updating a assignment!!'
            ],500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            Assignment::where('id', $request->post()["id"])->delete();
            return response()->json([
                'message'=>'Assignment Deleted Successfully!!'
            ]);
            
        } catch (\Exception $e) {
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while deleting a assignment!!'
            ]);
        }
    }
}
