import * as fs from 'fs'
import {resolve} from 'path'

/**
 * Fetches files recursivly in path. Filtered by extension with a missing extension resulting in all files.
 *
 * Credit: Mostly based on {@link https://stackoverflow.com/a/45130990}.
 *
 * @param directory directory to fetch from
 * @param extension extension to filter by
 * @returns
 */
export async function* fetchFilesFromDirectory(
  directory: fs.PathLike,
  extension?: string
): AsyncGenerator<string> {
  const dirents: fs.Dirent[] = await fs.promises.readdir(directory, {
    withFileTypes: true
  })

  // for item in directory
  for (const dirent of dirents) {
    const res: string = resolve(directory.toString(), dirent.name)

    if (dirent.isDirectory()) {
      yield* fetchFilesFromDirectory(res, extension)
    } else {
      // if dirent is a file and (extension is falsy or file ends with extension) yield item
      if (dirent.isFile() && (!extension || dirent.name.endsWith(extension))) {
        yield res
      }
    }
  }
}

/**
 * Convenience wrapper for {@link fs.promises.readFile}.
 *
 * @param path filepath to read
 * @returns
 */
export async function readFile(path: fs.PathLike): Promise<Buffer> {
  return fs.promises.readFile(path)
}

/**
 * Convenience wrapper for {@link fs.promises.writeFile}.
 *
 * @param path filepath to write
 * @param data data to write to file
 * @returns
 */
export async function saveFile(path: fs.PathLike, data: string): Promise<void> {
  return fs.promises.writeFile(path, data)
}
