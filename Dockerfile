FROM public.ecr.aws/lambda/nodejs:14

WORKDIR /app

COPY /target/  ./target/

RUN ls -la

CMD ["target/dist/lambdas/lambda-kinesis-entry-point.handler"]
