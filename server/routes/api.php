<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentCourseController;

Route::get('/instructor', [InstructorController::class, 'index']);
Route::post('/instructor/create', [InstructorController::class, 'store']);
Route::post('/instructor/update', [InstructorController::class, 'update']);
Route::post('/instructor/delete', [InstructorController::class, 'destroy']);

Route::get('/student', [StudentController::class, 'index']);
Route::post('/student/create', [StudentController::class, 'store']);
Route::post('/student/update', [StudentController::class, 'update']);
Route::post('/student/delete', [StudentController::class, 'destroy']);

Route::get('/course', [CourseController::class, 'index']);
Route::post('/course/create', [CourseController::class, 'store']);
Route::post('/course/update', [CourseController::class, 'update']);
Route::post('/course/delete', [CourseController::class, 'destroy']);

Route::get('/assignment', [AssignmentController::class, 'index']);
Route::post('/assignment/create', [AssignmentController::class, 'store']);
Route::post('/assignment/update', [AssignmentController::class, 'update']);
Route::post('/assignment/delete', [AssignmentController::class, 'destroy']);

Route::get('/grade', [GradeController::class, 'index']);
Route::post('/grade/create', [GradeController::class, 'store']);
Route::post('/grade/update', [GradeController::class, 'update']);
Route::post('/grade/delete', [GradeController::class, 'destroy']);

Route::get('/student_course', [StudentCourseController::class, 'index']);
Route::post('/student_course/create', [StudentCourseController::class, 'store']);
Route::post('/student_course/update', [StudentCourseController::class, 'update']);
Route::post('/student_course/delete', [StudentCourseController::class, 'destroy']);

Route::get('/account', [AccountController::class, 'index']);
Route::post('/account/create', [AccountController::class, 'store']);
Route::post('/account/update', [AccountController::class, 'update']);
Route::post('/account/delete', [AccountController::class, 'destroy']);

Route::post('/auth', [AccountController::class, 'login']);

