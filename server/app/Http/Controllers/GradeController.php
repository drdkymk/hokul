<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Grade;

class GradeController extends Controller
{
    public function index(Request $request){
        $courseID = $request->course;
        if( $courseID){
            return Grade::where('courseID', $courseID)->get();
        }
        return Grade::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'username'=>'required',
            'courseID'=>'required',
            'assignmentID'=>'required',
            'studentGrade'=>'required'
        ]);

        try{
            Grade::create($request->post());

            return response()->json([
                'message'=>'Grade Created Successfully!!'
            ]);
        }catch(\Exception $e){
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while creating a Grade!!'
            ],500);
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            'id'=>'required',
            'username'=>'required',
            'courseID'=>'required',
            'assignmentID'=>'required',
            'studentGrade'=>'required'
        ]);

        try{
            $grade = Grade::where("id",$request->post()["id"])->first();
            if($grade == null){
                $postValues = $request->post();
                unset($postValues["id"]);
                Grade::create($postValues);
                return response()->json([
                    'message'=>'Grade Created Successfully!!'
                ]);
            }

            Grade::find($request->post()["id"])->update($request->post());
            return response()->json([
                'message'=>'Grade Updated Successfully!!'
            ]);

        }catch(\Exception $e){
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while updating a grade!!'
            ],500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            if($request->post()["action"] == "clearStudent"){
                Grade::where([['courseID', $request->post()["courseID"]], ['username', $request->post()["username"]]])->delete();
            }
            else if($request->post()["action"] == "clearAssignment"){
                Grade::where([['courseID', $request->post()["courseID"]], ['assignmentID', $request->post()["assignmentID"]]])->delete();
            }

            Grade::where('id', $request->post()["id"])->delete();
            return response()->json([
                'message'=>'Grade Deleted Successfully!!'
            ]);
            
        } catch (\Exception $e) {
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while deleting a grade!!'
            ]);
        }
    }
}
