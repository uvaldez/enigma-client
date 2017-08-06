import gql from 'graphql-tag';

const addMessageMutation = gql`
    mutation($name: String!, $message: String!, $expiration: String!, $passphrase: String!) {
        addMessage(name: $name, message: $message, expiration: $expiration, hash: $passphrase) {
            id
            name
            expiration
            message
            hash
        }
    }
`;

export default addMessageMutation;
