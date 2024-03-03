'use server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'allow',
  max: 10,
  max_lifetime: 3,
})

//WORKING
export const getUser = async () => {
  const session = await getServerSession()
  await sql`
    INSERT INTO Users (Email)
    SELECT ${session?.user?.email!}
    WHERE NOT EXISTS (SELECT 1 FROM Users WHERE Email = ${session?.user
      ?.email!});
    `
  const id = await sql`
    SELECT id from Users
    WHERE Email = ${session?.user?.email!};
    `
  return id[0].id
}

export const getUserId = async (email: string) => {
  await sql`
    INSERT INTO Users (Email)
    SELECT ${email}
    WHERE NOT EXISTS (SELECT 1 FROM Users WHERE Email = ${email});
    `
  const id = await sql`
    SELECT id from Users
    WHERE Email = ${email};
    `
  return id[0].id
}

//WORKING
export const getEmail = async (userId: number) => {
  const email = await sql`
  SELECT email FROM Users
  WHERE id = ${userId}
  `
  return email[0].email
}

//WORKING
export const getRole = async (boardId: number) => {
  const session = await getServerSession()
  const role = await sql`
    SELECT Role.id
    FROM BoardUser
    JOIN Role ON BoardUser.RoleId = Role.Id
    JOIN Users ON BoardUser.UserId = Users.Id
    WHERE Users.Email = ${session?.user
      ?.email!} AND BoardUser.BoardId = ${boardId} 
  `
  if (role.length == 0) return redirect('/boards')
  return role[0].id
}

export const getUserRole = async (boardId: number, email: any) => {
  const role = await sql`
    SELECT Role.id
    FROM BoardUser
    JOIN Role ON BoardUser.RoleId = Role.Id
    JOIN Users ON BoardUser.UserId = Users.Id
    WHERE Users.Email = ${email} AND BoardUser.BoardId = ${boardId} 
  `
  if (role.length == 0) return redirect('/boards')
  return role[0].id
}

//WORKING
export const giveRole = async (
  email: string,
  boardId: number,
  roleId: number
) => {
  const userId = await getUserId(email)
  const id = await sql`
    INSERT INTO BoardUser (UserId, BoardId, RoleId)
    VALUES (${userId}, ${boardId}, ${roleId})
    RETURNING UserId
    `
  return id
}

//WORKING
export const createBoard = async (name: string) => {
  const session = await getServerSession()
  const userId = await getUser()
  const id = await sql`
    INSERT INTO Board (userId,Name)
    VALUES (${userId}, ${name})
    RETURNING id; 
    `
  await giveRole(session?.user?.email!, id[0].id, 1)
  return id[0].id
}

//WORKING
export const getBoards = async () => {
  const session = await getServerSession()
  const boards = await sql`
    SELECT Board.Id, Board.userId, Board.Name
    FROM BoardUser
    JOIN Board ON BoardUser.BoardId = Board.Id
    JOIN Users ON BoardUser.UserId = Users.Id
    WHERE Users.Email = ${session?.user?.email!}
    `
  return boards
}

//WORKING
export const getBoardsStates = async (BoardId: number) => {
  const states = await sql`
    SELECT *
    FROM State
    WHERE BoardId = ${BoardId}
    ORDER BY Index ASC
    `
  return states
}

//WORKING
export const createBoardsState = async (state: string, boardId: number) => {
  const ownerId = await sql`
  SELECT userId FROM board
  WHERE id = ${boardId}
  `
  var index = await getMaxIndex(boardId)
  if (!index) index = 0
  const userId = await getUser()
  if (ownerId[0].userid == userId) {
    const id = await sql`
      INSERT INTO State (StateName, BoardId, index)
      VALUES (${state}, ${boardId}, ${index + 1})
      RETURNING Id;
      `
    return id
  } else {
    return 'No permission'
  }
}

//WORKING
export const getBoardTasks = async (boardId: number) => {
  const tasks = await sql`
    SELECT tasks.Id, userId, Users.Email, Title, DescriptionText, StartDay, EndDay, StateId, state.statename
    FROM Tasks
    JOIN state ON state.id = Tasks.stateId
    JOIN Users ON Users.id = Tasks.userID
    WHERE Tasks.BoardId = ${boardId}
    `
  return tasks
}

//WORKING DATEFORMAT:2024-02-27
export const createTask = async (
  title: string,
  desc: string,
  start: string,
  end: string,
  stateId: number,
  boardId: number
) => {
  const userId = await getUser()
  const task = await sql`
    INSERT INTO Tasks (Title, DescriptionText, StartDay, EndDay, UserId, StateId, BoardId)
    VALUES (${title}, ${desc}, ${start}, ${end}, ${userId}, ${stateId}, ${boardId})
    RETURNING Id;
    `
  return task
}

//WORKING
export const delTask = async (taskId: number, boardId: number) => {
  const userId = await getUser()

  const ownerId = await sql`
  SELECT userId FROM board
  WHERE id = ${boardId}
  `

  const taskOwner = await sql`
  SELECT userId FROM tasks
  WHERE id = ${taskId}
  `
  if (userId == ownerId[0].userid || userId == taskOwner[0].userid) {
    const id = await sql`
      DELETE FROM Tasks 
      WHERE Id = ${taskId}
      RETURNING id
      `
    revalidatePath('/boards/' + boardId)
    return id
  } else return "You don't have permition"
}

//WORKING
export const updateTaskState = async (
  taskId: number,
  stateId: number,
  boardId: number
) => {
  const id = await sql`
    UPDATE Tasks
    SET StateId = ${stateId} 
    WHERE Id = ${taskId}
    RETURNING id
    `
  revalidatePath('/boards/' + boardId)
  return id
}

//WORKING
export const updateRole = async (
  roleId: number,
  userId: number,
  boardId: number
) => {
  const ownerId = await sql`
  SELECT userId FROM board
  WHERE id = ${boardId}
  `
  if (ownerId[0].userid == userId) return "You can't do that"
  const id = await sql`
    UPDATE BoardUser
    SET RoleId = ${roleId}
    WHERE UserId = ${userId} AND BoardId = ${boardId}
    RETURNING UserId
    `
  return id
}

//WORKING
export const getOwnerEmail = async (boardId: number) => {
  const ownerEmail = await sql`
  SELECT u.Email 
  FROM Users u
  JOIN Board b ON u.Id = b.UserId
  WHERE b.Id = ${boardId};
  `
  return ownerEmail[0].email
}

//WORKING
export const getAllBoards = async () => {
  const ids = await sql`
  SELECT id FROM board
  `
  return ids
}

export const getMembers = async (boardId: number) => {
  const members = sql`
    SELECT u.Id AS userId, u.Email, bu.RoleId as roleId
    FROM Users u
    JOIN BoardUser bu ON u.Id = bu.UserId
    JOIN Board b ON bu.BoardId = b.Id
    WHERE b.Id = ${boardId} 
    `
  return members
}

//WORKING
export const updateTask = async (
  title: string,
  desc: string,
  start: string,
  end: string,
  taskId: number,
  boardId: number
) => {
  const id = sql`
  UPDATE Tasks
  SET Title = ${title},
  DescriptionText = ${desc},
  StartDay = ${start},
  EndDay = ${end}
  WHERE Id = ${taskId}
  RETURNING id;
  `
  revalidatePath('/boards/' + boardId)
  return id
}

export const delBoard = async (boardId: number, ownerId: number) => {
  const userId = await getUser()
  if (ownerId == userId) {
    await sql`DELETE FROM BoardUser WHERE BoardId = ${boardId};`
    await sql`DELETE FROM State WHERE BoardId = ${boardId}; `
    await sql`DELETE FROM Tasks WHERE BoardId = ${boardId};`
    const del = await sql`    DELETE FROM Board WHERE Id = ${boardId}
    RETURNING id;`
    revalidatePath('/boards/' + boardId)
    return del
  } else {
    const del = await sql`
    DELETE FROM BoardUser 
    WHERE UserId = ${userId} AND BoardId = ${boardId}
    RETURNING BoardId ;
    `
    revalidatePath('/boards/' + boardId)
    return del
  }
}

export const removeRole = async (userId: number, boardId: number) => {
  const user = await sql`
  DELETE FROM BoardUser 
  WHERE BoardId = ${boardId}
  AND UserId = ${userId}
  RETURNING UserId;
  `
  return user
}

export const getMaxIndex = async (boardId: number) => {
  const index = await sql`
  SELECT MAX(Index) AS index
  FROM State
  WHERE BoardId = ${boardId};
`
  return index[0].index
}

export const delState = async (stateId: number, boardId: number) => {
  const session = await getServerSession()
  if ((await getOwnerEmail(boardId)) != session?.user?.email)
    return 'no permition'
  else {
    await sql`
    DELETE FROM Tasks
    WHERE StateId = ${stateId};
    `
    const id = await sql`
    DELETE FROM State 
    WHERE Id = ${stateId}
    RETURNING id; 
    `
    revalidatePath('/boards/' + boardId)
    return id
  }
}

export const changeStates = async (states: any, boardId: number) => {
  states.map(async (state: any, index: number) => {
    const id = await sql`
      UPDATE State
      SET Index = ${index + 1}
      WHERE Id = ${state.id}
      RETURNING id;
      `
    return id
  })
  revalidatePath('/boards/' + boardId)
}

export const editState = async (
  stateId: number,
  name: string,
  boardId: number
) => {
  const id = await sql`
    UPDATE State
    SET StateName = ${name}
    WHERE Id = ${stateId}
    RETURNING id;
    `
  revalidatePath('/boards/' + boardId)
  return id
}
