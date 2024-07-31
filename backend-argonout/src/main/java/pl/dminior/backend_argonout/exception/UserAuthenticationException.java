package pl.dminior.backend_argonout.exception;

public class UserAuthenticationException extends Exception{
    public UserAuthenticationException() {
        super("Current user is not authenticated!");
    }
}