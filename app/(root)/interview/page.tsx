import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
    const user = await getCurrentUser();

    // If user is null or undefined, handle that case
    if (!user) {
        return <p>User data not found</p>;
    }

    return (
        <>
            <h3>Interview generation</h3>
            <Agent
                userName={user.name}
                userId={user.id}
                profileImage={user.profileURL}
                type="generate"
            />
        </>
    );
};

export default Page;
