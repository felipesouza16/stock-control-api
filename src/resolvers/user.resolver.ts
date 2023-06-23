import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserInput, LoginInput, User } from "../schema/user.schema";
import UserService from "../service/user.service";
import Context from "../types/context";
import { ApolloError } from "apollo-server-core";

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => User)
  createUser(@Arg("input") input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => String) //Return JWT
  login(@Arg("input") input: LoginInput, @Ctx() context: Context) {
    return this.userService.login(input, context);
  }

  @Mutation(() => Boolean)
  logout(@Ctx() context: Context) {
    try {
      context.res.clearCookie("accessToken", {
        maxAge: 60 * 60 * 1000, // 1 hour
        httpOnly: false,
        path: "/",
        sameSite: "none",
        secure: true,
      });
      return true;
    } catch (error) {
      throw new ApolloError("Logout error.");
    }
  }

  @Query(() => [User])
  readAllUsers() {
    return this.userService.readAllUsers();
  }

  @Query(() => User)
  me(@Ctx() context: Context) {
    return context.user;
  }
}
