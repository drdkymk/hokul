<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;

class AccountController extends Controller
{

    public function index(Request $request){
        $role = $request->role;
        if($role == "instructor"){
            return Account::where('role', "Öğretmen")->get();
        }
        return Account::all();
    }

    public function login(Request $request){
        try{
            $user = Account::where([['username', $request->post()["username"]], ['password', $request->post()["password"]]])->first();
            return $user;
        }catch(\Exception $e){
            echo $e->getMessage();
            return "aasdas";
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'username'=>'required',
            'name'=>'required',
            'lastname'=>'required',
            'password'=>'required',
            'role'=>'required'
        ]);

        try{
            Account::create($request->post());

            return response()->json([
                'message'=>'Account Created Successfully!!'
            ]);
        }catch(\Exception $e){
            //\Log::error($e->getMessage());
            echo $e->getMessage();
            return response()->json([
                'message'=>'Something goes wrong while creating a Account!!'
            ],500);
        }
    }

    public function show(Account $account)
    {
        return response()->json([
            'account'=>$account
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id'=>'required',
            'username'=>'required',
            'name'=>'required',
            'lastname'=>'required',
            'password'=>'required',
            'role'=>'required'
        ]);

        try{
            Account::find($request->post()["id"])->update($request->post());
            return response()->json([
                'message'=>'Account Updated Successfully!!'
            ]);

        }catch(\Exception $e){
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while updating a account!!'
            ],500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            Account::where('id', $request->post()["id"])->delete();
            return response()->json([
                'message'=>'Account Deleted Successfully!!'
            ]);
            
        } catch (\Exception $e) {
            echo $e->getMessage();
            //\Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while deleting a account!!'
            ]);
        }
    }
}
