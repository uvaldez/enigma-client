import gql from 'graphql-tag';

const getMessage = gql`
    mutation($passphrase: String!, $message: String!) {
        getMessage(passphrase:$passphrase,message:$message)
        {
            hash
            name
            message
            expiration

        }
    }
`;

export default getMessage;
