



export default function Header() {

    localStorage.getItem('token');

    const role = localStorage.getItem('role');

    return (
        <>
            <div>
                <h1 className='text-lg font-bold'>Leave Request Management</h1>
            </div>
        </>
    )
}