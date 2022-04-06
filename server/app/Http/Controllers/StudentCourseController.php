<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentCourse;

class StudentCourseController extends Controller
{
    public function index(Request $request){
        $courseID = $request->course;
        if( $courseID){
            return StudentCourse::where('courseID', $courseID)->get();
        }
        return StudentCourse::all();
    }




    public function store(Request $request)
    {
        $request->validate([
            'courseID'=>'required',
            'studentID'=>'required'
        ]);

        try{
            StudentCourse::create($request->post());

            return response()->json([
                'message'=>'StudentCourse Created Successfully!!'
            ]);
        }catch(\Exception $e){
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while creating a StudentCourse!!'
            ],500);
        }
    }

    public function show(StudentCourse $studentCourse)
    {
        return response()->json([
            'studentCourse'=>$studentCourse
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id'=>'required',
            'courseID'=>'required',
            'studentID'=>'required'
        ]);

        try{
            StudentCourse::find($request->post()["id"])->update($request->post());
            return response()->json([
                'message'=>'StudentCourse Updated Successfully!!'
            ]);

        }catch(\Exception $e){
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while updating a studentCourse!!'
            ],500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            StudentCourse::where([['courseID', $request->post()["courseID"]], ['studentID', $request->post()["studentID"]]])->delete();
            return response()->json([
                'message'=>'StudentCourse Deleted Successfully!!'
            ]);
            
        } catch (\Exception $e) {
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while deleting a StudentCourse!!'
            ]);
        }
    }
}
