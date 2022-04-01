<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\GradeController;


use App\Http\Controllers\InstructorController;
use App\Http\Controllers\StudentController;

Route::get('/instructor', [InstructorController::class, 'index']);
Route::post('/instructor/create', [InstructorController::class, 'store']);
Route::post('/instructor/up', [InstructorController::class, 'update']);
Route::delete('/instructor', [InstructorController::class, 'destroy']);

Route::get('/student', [StudentController::class, 'index']);
Route::get('/account', [AccountController::class, 'index']);
Route::get('/assignment', [AssignmentController::class, 'index']);
Route::get('/course', [CourseController::class, 'index']);
Route::get('/grade', [GradeController::class, 'index']);