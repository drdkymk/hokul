<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    public function index(){
        return Student::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'username'=>'required',
            'name'=>'required',
            'lastname'=>'required'
        ]);

        try{
            Student::create($request->post());

            return response()->json([
                'message'=>'Student Created Successfully!!'
            ]);
        }catch(\Exception $e){
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while creating a Student!!'
            ],500);
        }
    }

    public function show(Student $student)
    {
        return response()->json([
            'student'=>$student
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'username'=>'required',
            'name'=>'required',
            'lastname'=>'required'
        ]);

        try{
            Student::where('username',$request->post()["username"])->update($request->post());
            return response()->json([
                'message'=>'Student Updated Successfully!!'
            ]);

        }catch(\Exception $e){
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while updating a student!!'
            ],500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            Student::where('username', $request->post()["username"])->delete();
            return response()->json([
                'message'=>'Student Deleted Successfully!!'
            ]);
            
        } catch (\Exception $e) {
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while deleting a student!!'
            ]);
        }
    }
}
