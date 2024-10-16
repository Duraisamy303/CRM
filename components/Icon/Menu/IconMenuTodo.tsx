import { FC } from 'react';

interface IconTodosProps {
    className?: string;
}

const IconTodos: FC<IconTodosProps> = ({ className }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M4 6.5C4 6.22386 4.22386 6 4.5 6H9.5C9.77614 6 10 6.22386 10 6.5V7.5C10 7.77614 9.77614 8 9.5 8H4.5C4.22386 8 4 7.77614 4 7.5V6.5ZM4 11.5C4 11.2239 4.22386 11 4.5 11H15.5C15.7761 11 16 11.2239 16 11.5V12.5C16 12.7761 15.7761 13 15.5 13H4.5C4.22386 13 4 12.7761 4 12.5V11.5ZM4.5 16C4.22386 16 4 16.2239 4 16.5V17.5C4 17.7761 4.22386 18 4.5 18H12.5C12.7761 18 13 17.7761 13 17.5V16.5C13 16.2239 12.7761 16 12.5 16H4.5ZM18.7071 6.29289L15 10L13.2929 8.29289C13.1054 8.10536 12.8946 8.10536 12.7071 8.29289L11.2929 9.70711C11.1054 9.89464 11.1054 10.1054 11.2929 10.2929L15 14L19.7071 9.29289C19.8946 9.10536 19.8946 8.89464 19.7071 8.70711L18.2929 7.29289C18.1054 7.10536 17.8946 7.10536 17.7071 7.29289Z"
                fill="currentColor"
            />
        </svg>
    );
};

export default IconTodos;
