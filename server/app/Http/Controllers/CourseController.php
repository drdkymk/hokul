<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;

class CourseController extends Controller
{

    public function index(Request $request){
        $username = $request->instructor;
        if( $username){
            return Course::where('instructorID', $username)->get();
        }
        return Course::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'courseCode'=>'required',
            'courseName'=>'required',
            'instructorID'=>'required'
        ]);

        try{
            $id = Course::create($request->post())->id;

            return response()->json([
                'message'=>'Course Created Successfully!!',
                'id'=>$id
            ]);
        }catch(\Exception $e){
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while creating a Course!!'
            ],500);
        }
    }

    public function show(Course $course)
    {
        return response()->json([
            'course'=>$course
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id'=>'required',
            'courseCode'=>'required',
            'courseName'=>'required',
            'instructorID'=>'required'
        ]);

        try{
            Course::find($request->post()["id"])->update($request->post());
            return response()->json([
                'message'=>'Course Updated Successfully!!'
            ]);

        }catch(\Exception $e){
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while updating a course!!'
            ],500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            Course::where('id', $request->post()["id"])->delete();
            return response()->json([
                'message'=>'Course Deleted Successfully!!'
            ]);
            
        } catch (\Exception $e) {
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while deleting a course!!'
            ]);
        }
    }
}
