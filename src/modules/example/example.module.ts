import { Module } from "@nestjs/common";
import { ExampleService } from "./example.service";
import { ExampleController } from "./example.controller";

@Module({
    imports: [],
    controllers: [ExampleController],
    providers: [ExampleService],
    exports: []
})
export class ExampleModule { }
