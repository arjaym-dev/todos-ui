/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { NextRequest as Request, NextResponse as Response } from "next/server";
import { ValidationError } from "yup";

import Role, { Roles } from "@/app/models/roles";

import { CreateUser, createUserSchema } from "@/shared/validation/users";
import dbConnect from "@/shared/lib/db-connect";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const payload: CreateUser = await request.json();

    // Validate payload
    await createUserSchema.validate(payload, {
      abortEarly: false,
    });

    // Check assign roles & Validate if user allow for creating user account
    const roles = await Role.find({});

    console.log(roles);
    // Hash password

    // Save user into collection
    return Response.json(
      {
        message: "Test",
      },
      { status: 201, statusText: "Created" }
    );
  } catch (error) {
    let resError: { [key: string]: string } = {},
      status = 500;

    if (error instanceof ValidationError) {
      // Validate payload send error message
      error.inner.forEach((err: any) => {
        const path = err.path;
        const message = err.message;

        resError[path] = message;
      });

      status = 400;
    }

    console.log("Creating user account error occured:", error);
    return Response.json(resError, { status: status });
  }
}
